import cv2, numpy as np
from pymatting import estimate_alpha_cf, estimate_foreground_ml
im=cv2.imread('../bb_src/v1_sheet.jpg'); X0,Y0,X1,Y1=0,212,712,816
roi=im[Y0:Y1,X0:X1].copy(); H,W=roi.shape[:2]
m=(cv2.imread('mask1.png',0)>127).astype(np.uint8)
hsv=cv2.cvtColor(roi,cv2.COLOR_BGR2HSV).astype(np.float32); Hh,S,V=hsv[:,:,0]*2,hsv[:,:,1]/255,hsv[:,:,2]/255
rows=np.arange(H)[:,None]*np.ones((1,W))
m[((Hh>12)&(Hh<60)&(S>0.10)&(S<0.7)&(V>0.38))&(rows>H-75)]=0
m=cv2.morphologyEx(m,cv2.MORPH_OPEN,np.ones((3,3),np.uint8))
n,lab,st,_=cv2.connectedComponentsWithStats(m,8); big=1+np.argmax(st[1:,4]); m=(lab==big).astype(np.uint8)
# fill small interior holes
inv=1-m; n2,lab2,st2,_=cv2.connectedComponentsWithStats(inv,4)
for i in range(1,n2):
    if st2[i,4]<400 and st2[i,0]>0 and st2[i,1]>0 and st2[i,0]+st2[i,2]<W and st2[i,1]+st2[i,3]<H: m[lab2==i]=1
sure_fg=cv2.erode(m,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(9,9)))
sure_bg=1-cv2.dilate(m,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(11,11)))
tri=np.full((H,W),0.5,np.float64); tri[sure_fg==1]=1.0; tri[sure_bg==1]=0.0
rgb=cv2.cvtColor(roi,cv2.COLOR_BGR2RGB).astype(np.float64)/255
alpha=estimate_alpha_cf(rgb,tri)
alpha=np.clip(alpha,0,1)
fgc=estimate_foreground_ml(rgb,alpha)
out=np.dstack([np.clip(fgc,0,1),alpha]); 
cv2.imwrite('cut_rgba.png',cv2.cvtColor((out*255).astype(np.uint8),cv2.COLOR_RGBA2BGRA))
a8=(alpha*255).astype(np.uint8)
for name,bgc in [('magenta',(255,0,255)),('pale',(229,238,251)),('navy',(11,42,107))]:
    b=np.zeros((H,W,3),np.float64); b[:]=bgc; comp=fgc*alpha[:,:,None]+ (b/255)*(1-alpha[:,:,None])
    cv2.imwrite(f'cut_on_{name}.png',cv2.cvtColor((comp*255).astype(np.uint8),cv2.COLOR_RGB2BGR))
print('alpha bbox',np.where(a8>10)[1].min(),np.where(a8>10)[0].min(),np.where(a8>10)[1].max(),np.where(a8>10)[0].max(),'of',W,H)
