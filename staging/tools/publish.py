#!/usr/bin/env python3
"""Publish the GB GAMER BROS(tm) site to GitHub Pages (main).  Three independent operations:

  python3 staging/tools/publish.py dry-run      validate and prepare BOTH changes in temporary worktrees; push nothing, change nothing
  python3 staging/tools/publish.py staging      publish the committed dev build to /staging/ ONLY; the production root is never touched
  python3 staging/tools/publish.py production --expect r-xxxxxxxx
                                                promote the build that is ALREADY STAGED on main to the production root
                                                (independent of the dev branch; runs even when staging has no new changes)

staging
  * the dev branch must be committed; revision.py --check, check_invariants.py and asset_allowlist.py must pass
  * only public staging files are copied (no *.md, no tools/); /staging/ is replaced as a whole, so removed assets disappear
  * the main-branch CI guard tools/check_staging_invariants.py is synced in the same commit (the only file outside staging/ it may change)
  * refuses if anything else outside staging/ would change; "already current" is a success, not an error

production
  * source = staging/ as it is on origin/main (the build that was reviewed), NOT the dev tree; --expect must equal its revision
  * the staged build is re-validated (check_invariants.py, asset_allowlist.py, the main-branch CI guard)
  * ONE commit that touches only the root site; it is skipped with a clear message only if the root is already identical
  * replaced: the root homepage and the files the staged build ships at root (js/css/json/html), plus the sub-folders of root assets/
    (rebuilt from the staged build, so superseded images stop being public)
  * preserved: /v2/, /staging/, CNAME, .nojekyll, .github/, README, docs/, tools/, site.css, site.js and every loose file in root assets/
    (/v2/ uses assets/logo.png, hero-3.jpg and map.jpg); the push is refused if any of those would change
  * noindex is removed from the root homepage only
  * independently reversible: `git revert <commit printed at the end>` restores the previous production root
"""
import os, shutil, subprocess, sys, tempfile

REPO = subprocess.check_output(["git", "rev-parse", "--show-toplevel"], text=True).strip()
SESSION = "Claude-Session: https://claude.ai/code/session_01LPFrrt91CSr8icc1zm77A8"
GUARD = "tools/check_staging_invariants.py"
PRESERVED = ("v2", "staging", "CNAME", ".nojekyll", ".github", "README.md", "docs", "tools", "site.css", "site.js")
ROOT_FILES = ("staging.css", "revision.json")        # plus every *.html / *.js shipped by the staged build


def git(*args, cwd=REPO, out=False):
    if out:
        return subprocess.check_output(["git", *args], cwd=cwd, text=True).strip()
    subprocess.check_call(["git", *args], cwd=cwd)


def run(*cmd, cwd=REPO):
    if subprocess.call(list(cmd), cwd=cwd):
        raise SystemExit("check failed: " + " ".join(os.path.relpath(c, REPO) if os.path.isabs(c) else c for c in cmd))


def fetch_main():
    for _ in range(4):
        if subprocess.call(["git", "fetch", "-q", "origin", "main"], cwd=REPO) == 0:
            return
    raise SystemExit("could not fetch origin/main")


def worktree():
    fetch_main()
    tmp = tempfile.mkdtemp(prefix="gb-publish-")
    git("worktree", "add", "-q", "--detach", tmp, "origin/main")
    return tmp


def drop(tmp):
    subprocess.call(["git", "worktree", "remove", "--force", tmp], cwd=REPO)


def push(tmp, what, sha):
    for _ in range(4):
        if subprocess.call(["git", "push", "-q", "origin", "HEAD:main"], cwd=tmp) == 0:
            print(f"PUSHED {what}: main is now {sha}")
            return
    raise SystemExit("push failed")


def revision_of(staging_dir):
    return open(os.path.join(staging_dir, "revision.json")).read().split('"')[3]


# ---------------------------------------------------------------- staging
def check_dev():
    if git("status", "--porcelain", "--", "staging", out=True):
        raise SystemExit("commit the dev branch first (staging/ has uncommitted changes)")
    run(sys.executable, os.path.join(REPO, "staging/tools/revision.py"), "--check")
    run(sys.executable, os.path.join(REPO, "staging/tools/check_invariants.py"))
    run(sys.executable, os.path.join(REPO, "staging/tools/asset_allowlist.py"))


def prepare_staging(tmp):
    """Replace tmp/staging with the committed dev build; return (revision, commit sha or None when already current)."""
    dev_sha = git("rev-parse", "--short", "HEAD", out=True)
    rev = revision_of(os.path.join(REPO, "staging"))
    shutil.rmtree(os.path.join(tmp, "staging"), ignore_errors=True)
    archive = subprocess.check_output(["git", "archive", "HEAD", "staging"], cwd=REPO)
    subprocess.run(["tar", "-x", "-C", tmp], input=archive, check=True)
    shutil.rmtree(os.path.join(tmp, "staging/tools"), ignore_errors=True)
    for root, _, files in os.walk(os.path.join(tmp, "staging")):
        for f in files:
            if f.endswith(".md"):
                os.remove(os.path.join(root, f))
    git("add", "-A", "staging", cwd=tmp)
    # the main-branch CI guard (tools/check_staging_invariants.py) must match the build it guards, or the push turns CI red
    shutil.copy2(os.path.join(REPO, GUARD), os.path.join(tmp, GUARD))
    git("add", GUARD, cwd=tmp)
    outside = git("diff", "--cached", "--name-only", "origin/main", "--", ".", ":!staging", f":!{GUARD}", cwd=tmp, out=True)
    if outside:
        raise SystemExit("refusing: files outside staging/ would change:\n" + outside)
    stat = git("diff", "--cached", "--stat", "origin/main", cwd=tmp, out=True)
    if not stat:
        return rev, None
    print(stat.splitlines()[-1])
    git("commit", "-q", "-m", f"Publish staging {rev} (dev {dev_sha})\n\nPublic /staging/ files only; the production root and /v2/ are unchanged.\n\n"
        f"Co-Authored-By: Claude <noreply@anthropic.com>\n{SESSION}", cwd=tmp)
    return rev, git("rev-parse", "--short", "HEAD", cwd=tmp, out=True)


def do_staging(dry):
    check_dev()
    tmp = worktree()
    try:
        rev, sha = prepare_staging(tmp)
        if sha is None:
            print(f"staging on main is already {rev}; nothing to publish (production untouched)")
            return rev
        if dry:
            print(f"DRY RUN: would publish staging {rev} as {sha}; nothing pushed")
        else:
            push(tmp, f"staging {rev}", sha)
        return rev
    finally:
        drop(tmp)


# ------------------------------------------------------------- production
def promote(tmp):
    """Overlay the build in tmp/staging onto the production root of worktree tmp (no commit)."""
    src = os.path.join(tmp, "staging")
    assets = os.path.join(tmp, "assets")
    for f in os.listdir(src):
        p = os.path.join(src, f)
        if os.path.isfile(p) and (f.endswith((".html", ".js")) or f in ROOT_FILES):
            if os.path.exists(os.path.join(tmp, f)):
                os.remove(os.path.join(tmp, f))
    for f in os.listdir(assets):
        if os.path.isdir(os.path.join(assets, f)):
            shutil.rmtree(os.path.join(assets, f))
    for name in os.listdir(src):
        s_, d_ = os.path.join(src, name), os.path.join(tmp, name)
        if os.path.isdir(s_):
            shutil.copytree(s_, d_, dirs_exist_ok=True)
        else:
            shutil.copy2(s_, d_)
    idx = os.path.join(tmp, "index.html")
    html = open(idx, encoding="utf-8").read()
    html = html.replace('<meta name="robots" content="noindex">\n', "").replace('<meta name="robots" content="noindex">', "")
    open(idx, "w", encoding="utf-8").write(html)
    git("add", "-A", ".", ":!staging", cwd=tmp)


def prepare_production(tmp, expect):
    rev = revision_of(os.path.join(tmp, "staging"))
    if expect and rev != expect:
        raise SystemExit(f"refusing: staging on main is {rev}, not the expected {expect}")
    sdir = os.path.join(tmp, "staging")
    run(sys.executable, os.path.join(REPO, "staging/tools/check_invariants.py"), sdir)
    run(sys.executable, os.path.join(REPO, "staging/tools/asset_allowlist.py"), "--check", sdir)
    before_root = revision_of(tmp) if os.path.exists(os.path.join(tmp, "revision.json")) else "unknown"
    promote(tmp)
    touched = git("diff", "--cached", "--name-only", "HEAD", cwd=tmp, out=True).splitlines()
    bad = [f for f in touched if f.split("/")[0] in PRESERVED or f.startswith("assets/") and "/" not in f[len("assets/"):]]
    if bad:
        raise SystemExit("refusing: preserved files would change:\n" + "\n".join(bad[:20]))
    run(sys.executable, os.path.join(tmp, GUARD), sdir)      # main's own CI guard (synced by the staging operation)
    if revision_of(tmp) != rev:
        raise SystemExit("refusing: root revision.json does not match the staged build")
    stat = git("diff", "--cached", "--stat", "HEAD", cwd=tmp, out=True)
    if not stat:
        return rev, before_root, None
    print(stat.splitlines()[-1])
    git("commit", "-q", "-m", f"Promote staging {rev} to the production root (was {before_root})\n\n"
        "Root site = the staged build already published to /staging/ (noindex removed at root only).\n"
        "Preserved: /v2/, /staging/, CNAME, .nojekyll, .github, README, docs, tools, site.css, site.js and the loose files in assets/.\n"
        "Revert this single commit to restore the previous production root.\n\n"
        f"Co-Authored-By: Claude <noreply@anthropic.com>\n{SESSION}", cwd=tmp)
    return rev, before_root, git("rev-parse", "--short", "HEAD", cwd=tmp, out=True)


def do_production(expect, dry):
    tmp = worktree()
    try:
        rev, before, sha = prepare_production(tmp, expect)
        if sha is None:
            print(f"production root is already identical to staged {rev}; nothing to promote")
            return
        if dry:
            print(f"DRY RUN: would promote staged {rev} (root was {before}) as {sha}; revert with `git revert {sha}`; nothing pushed")
        else:
            push(tmp, f"production {rev} (root was {before}); revert with `git revert {sha}`", sha)
    finally:
        drop(tmp)


def do_dry_run():
    """Validate and prepare staging from the dev build, then production on top of it, in a throwaway worktree. Nothing is pushed."""
    check_dev()
    tmp = worktree()
    try:
        rev, sha = prepare_staging(tmp)
        print(f"staging {rev}: " + (f"would publish as {sha}" if sha else "already current on main"))
        prep, before, psha = prepare_production(tmp, rev)
        print(f"production {prep}: " + (f"would promote as {psha} (root was {before}); revertable with one `git revert`" if psha else "already identical"))
        print("DRY RUN complete; nothing was pushed")
    finally:
        drop(tmp)


def main(argv):
    op = argv[0] if argv else ""
    expect = argv[argv.index("--expect") + 1] if "--expect" in argv else None
    if op == "dry-run":
        do_dry_run()
    elif op == "staging":
        do_staging(dry=False)
    elif op == "production":
        if not expect:
            raise SystemExit("production needs --expect <staged revision> so a build nobody reviewed is never promoted")
        do_production(expect, dry=False)
    else:
        raise SystemExit(__doc__)


if __name__ == "__main__":
    main(sys.argv[1:])
