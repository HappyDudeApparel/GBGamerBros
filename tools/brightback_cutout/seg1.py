import cv2, numpy as np
im=cv2.imread('../bb_src/v1_sheet.jpg'); X0,Y0,X1,Y1=0,212,712,816
roi=im[Y0:Y1,X0:X1].copy(); H,W=roi.shape[:2]; print(roi.shape)
hsv=cv2.cvtColor(roi,cv2.COLOR_BGR2HSV).astype(np.float32); Hh,S,V=hsv[:,:,0]*2,hsv[:,:,1]/255,hsv[:,:,2]/255
mask=np.full((H,W),cv2.GC_PR_FGD,np.uint8)
# definite background: pale low-saturation (sky, cloud, mountain snow) and sky blue
pale=(S<0.22)&(V>0.80)
sky=(Hh>185)&(Hh<225)&(S<0.55)&(V>0.70)
mask[pale|sky]=cv2.GC_PR_BGD
# definite background borders: top-left tip region excluded below; image border
mask[:3,:]=cv2.GC_BGD; mask[:,W-3:]=cv2.GC_BGD
# caption box (sheet x 0..222, y 768..830) is background by definition
cy0,cy1=768-Y0,830-Y0; mask[cy0:cy1,0:222]=cv2.GC_BGD
# definite foreground: dark purple rocks (low V, purple hue)
rock=(V<0.50)&(((Hh>260)&(Hh<345))|(Hh<20))&(S>0.25)
mask[rock]=cv2.GC_FGD
bg=np.zeros((1,65),np.float64); fg=np.zeros((1,65),np.float64)
cv2.grabCut(roi,mask,None,bg,fg,6,cv2.GC_INIT_WITH_MASK)
m=((mask==cv2.GC_FGD)|(mask==cv2.GC_PR_FGD)).astype(np.uint8)
cv2.imwrite('mask1.png',m*255)
vis=roi.copy(); vis[m==0]=(255,0,255); cv2.imwrite('vis1.png',vis)
