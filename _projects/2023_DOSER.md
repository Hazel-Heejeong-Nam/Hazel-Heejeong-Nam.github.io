---
layout: project
title: Enhanced Open Set Recognition via Feature Disentanglement
subtitle: "Realistic Unseen Data Generation using Style-Content Disentangling"
---
<script src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML" type="text/javascript"></script>

**Abstract.**
Open set recognition (OSR) is a subfield of out-of-distribution (OOD) detection that involves simultaneously performing multi-class classification on in-distribution data and OOD detection tasks. Particularly, OSR aims to address the fundamental challenge faced by OOD detection due to the overconfident attitude of softmax classifiers, by transforming the closed set setting into an open set setting through various methods. In this regard, we propose a novel model that leverages manifold mix-up for unknown generation, as commonly employed in existing models, but reinterprets it from the perspective of style-content disentangling. Our proposed model allows for the enforcement of disentangling, which can be beneficial for the OSR task.

{%
	include image_with_caption.html
	url="/assets/projects/2023_DOSER/osr.png"
	width="60%"
%}

Unlike other OOD tasks, open set recognition presents several challenging conditions during the training process: it relies solely on in-distribution data, there can be multiple classes within the in-distribution data itself, OOD samples may not exhibit significant differences from the in-distribution data, and it requires not only OOD detection but classification for in-distribution data. In the early stages of open set recognition, various calibration techniques, including extreme value theory, were commonly used. As the field of OOD detection has evolved, several methods, such as distance-based approaches, sparse representation, reconstruction error, and unknown generation have been expanded and widely adopted. Among these methods, we adopted Zhou et al.’s approach that utilizes unknown generation as our baseline. Unknown generation, also referred as fake data generation, is not only applicable to OOD detection but also can be used in various applications. Firstly, we slightly reinterpret the PROSER model to enhance its efficiency in operation; In order to secure the model's potential and ensure training stability, we have modified the model's training process to fully utilize the mini-batch while maintaining a simpler training flow. The objective function remains the same, and this modification does not violate any assumptions of the original model, while serving the purpose of training more effectively.

{%
	include image_with_caption.html
	url="/assets/projects/2023_DOSER/doser.png"
	width="100%"
%}

Performing mix-up at the final layer of the network would introduce excessive variations to the data, making it challenging to predict unknown data accurately at the inference phase. Hence Zhou et al. tried to preserve the data distribution to some extent while altering only the fine details from the middle layers. From the perspective of disentangling, it can be considered as a serial style content disentangling. The mixing portion determines the content, i.e., the shape of the numbers in the case of MNIST data, while ensuring that the mixed data retains the same texture and style as the original data, thereby generating more realistic unknown sample. To strengthen this aspect, we considered the part before the mix-up layer as the content encoder and the subsequent part as the style encoder, serially connected. Additional regularization was applied to allow the in-distribution data to share the latent space for style, aiming to ensure that each latent captures the intended information in style-content disentangling. When passing the mixed style and content to the decoder, which contains global information from the style and detailed information from the content, the decoder strives to reconstruct the full original image. 

**Slide can be found here.** <br/>
<iframe width="560" height="315" src="https://drive.google.com/file/d/1NXD215p10jhKknq1B1Y9sYdr612LibW1/view?usp=sharing" frameborder="0" allowfullscreen></iframe>
