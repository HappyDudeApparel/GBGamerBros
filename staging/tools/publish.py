#!/usr/bin/env python3
"""Publish the committed /staging/ build from the dev branch to main (GitHub Pages).

  python3 staging/tools/publish.py            # publish
  python3 staging/tools/publish.py --dry-run  # prepare and show the diff, don't push

Rules enforced:
  * the dev branch must be committed and revision.py --check must pass
  * only public staging files are copied (no *.md, no tools/)
  * staging/ on main is replaced as a whole, so removed/renamed assets disappear
  * nothing outside staging/ may change on main (root homepage and /v2/ untouched)
"""
import os, shutil, subprocess, sys, tempfile

REPO = subprocess.check_output(["git", "rev-parse", "--show-toplevel"], text=True).strip()


def git(*args, cwd=REPO, out=False):
    if out:
        return subprocess.check_output(["git", *args], cwd=cwd, text=True).strip()
    subprocess.check_call(["git", *args], cwd=cwd)


def main(dry):
    if git("status", "--porcelain", "--", "staging", out=True):
        raise SystemExit("commit the dev branch first (staging/ has uncommitted changes)")
    if subprocess.call([sys.executable, os.path.join(REPO, "staging/tools/revision.py"), "--check"]):
        raise SystemExit("revision check failed — run staging/tools/revision.py and commit")
    dev_sha = git("rev-parse", "--short", "HEAD", out=True)
    rev = open(os.path.join(REPO, "staging/revision.json")).read().split('"')[3]
    for i in range(4):
        if subprocess.call(["git", "fetch", "-q", "origin", "main"], cwd=REPO) == 0:
            break
    tmp = tempfile.mkdtemp(prefix="gb-publish-")
    try:
        git("worktree", "add", "-q", "--detach", tmp, "origin/main")
        shutil.rmtree(os.path.join(tmp, "staging"), ignore_errors=True)
        archive = subprocess.check_output(["git", "archive", "HEAD", "staging"], cwd=REPO)
        subprocess.run(["tar", "-x", "-C", tmp], input=archive, check=True)
        shutil.rmtree(os.path.join(tmp, "staging/tools"), ignore_errors=True)
        for root, _, files in os.walk(os.path.join(tmp, "staging")):
            for f in files:
                if f.endswith(".md"):
                    os.remove(os.path.join(root, f))
        git("add", "-A", "staging", cwd=tmp)
        outside = git("diff", "--cached", "--name-only", "origin/main", "--", ".", ":!staging", cwd=tmp, out=True)
        if outside:
            raise SystemExit("refusing: files outside staging/ would change:\n" + outside)
        stat = git("diff", "--cached", "--stat", "origin/main", cwd=tmp, out=True)
        print(stat or "no changes to publish")
        if not stat:
            return
        msg = (f"Publish staging {rev} (dev {dev_sha})\n\n"
               "Public /staging/ files only; root homepage and /v2/ unchanged.\n\n"
               "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>\n"
               "Claude-Session: https://claude.ai/code/session_01WDMc6omQTtU5QGMbzTfAf7")
        git("commit", "-q", "-m", msg, cwd=tmp)
        sha = git("rev-parse", "--short", "HEAD", cwd=tmp, out=True)
        if dry:
            print(f"dry run: would push {sha} to main")
            return
        for i in range(4):
            if subprocess.call(["git", "push", "-q", "origin", "HEAD:main"], cwd=tmp) == 0:
                print(f"published {rev} as main {sha}")
                return
        raise SystemExit("push failed")
    finally:
        subprocess.call(["git", "worktree", "remove", "--force", tmp], cwd=REPO)


if __name__ == "__main__":
    main("--dry-run" in sys.argv)
