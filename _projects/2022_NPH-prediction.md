---
layout: project
title: Normal Pressure Hydrocephalus Prediction
subtitle: 3D CT-Image Segmentation and Classification
---
Under the guidance of Professor B.S. Manjunath at the UCSB Vision Research Lab, I embarked on the real-time prediction of Normal Pressure Hydrocephalus (NPH) task, facilitated through the interactive platform, BisQue. By employing 3D brain CT-scan images, we aimed to predict the disease by calculating ventricle volume through semantic segmentation. However, we encountered two distinct challenges:


* **The commonly used U-Net architecture, renowned for segmentation tasks, proved slower for our interactive platform**
* **The ventricle's similarity in intensity to the subarachnoid region hindered effective separation, which is crucial for the task.**


To address the first problem, we opted ResNet architecture as the backbone. We judiciously cropped larger voxel chunks, enabling the prediction of smaller, localized regions. This not only facilitated swift inference but also enabled the incorporation of contextual information from neighboring regions into our predictions, enhancing the overall stability of the model. Second issue was addressed through post-processing techniques, resolving connectivity and refining proximate prediction outcomes.

