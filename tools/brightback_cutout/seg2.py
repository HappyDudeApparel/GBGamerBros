import cv2, numpy as np
im=cv2.imread('../bb_src/v1_sheet.jpg'); X0,Y0,X1,Y1=0,212,712,816
roi=im[Y0:Y1,X0:X1].copy(); H,W=roi.shape[:2]
m=(cv2.imread('mask1.png',0)>127).astype(np.uint8)
hsv=cv2.cvtColor(roi,cv2.COLOR_BGR2HSV).astype(np.float32); Hh,S,V=hsv[:,:,0]*2,hsv[:,:,1]/255,hsv[:,:,2]/255
rows=np.arange(H)[:,None]*np.ones((1,W))
tan=((Hh>12)&(Hh<60)&(S>0.10)&(S<0.7)&(V>0.38))&(rows>H-75)
m[tan]=0
# open to cut thin ground bridges, then components
m=cv2.morphologyEx(m,cv2.MORPH_OPEN,np.ones((3,3),np.uint8))
n,lab,st,cen=cv2.connectedComponentsWithStats(cv2.dilate(m,np.ones((5,5),np.uint8)),8)
for i in range(1,n):
    if st[i,4]>200: print(i,'area',st[i,4],'bbox',st[i,:4].tolist(),'centroid',[int(c) for c in cen[i]])
