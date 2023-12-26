---
title: "[Paper] CausalGAN : Learning Causal Implicit Generative Models with Adversarial Training"
layout: post
post-image: "/assets/posts/causalgan/thumb.png"
description: ICLR 2018
tags:
- Causality
- Generative Model
- Weakly-supervised learning
- Computer vision
---
### GAN
Let's briefly think about GANs. There are two notable features: firstly, as adversarial networks, they consist of generative and discriminative models that compete with each other. Secondly, they involve sampling from image distributions, where given independent noise influences the output.

Imagine an image with multiple labels (e.g., gender, mustache, baldness, etc.). In GANs, these labels are generally considered independent. Therefore, fixing one label (as a condition) does not affect the distribution of other labels.

The author notes a problem here. For example, if we generate images with the label mustache=1, GANs might produce images of both men and women with mustaches. However, in the training set, there might be no women with mustaches.

### Conditioning on the labels

Through such examples, it is argued that GANs conditioned on labels can generate more realistic data distributions. Here, the author proposes to implement this conditioning and the resulting distribution changes through causality.

Considering the initial goal of 'Image conditioned on label', we can deduce that the label determines the image distribution, hence the generator maps the label to the distribution (L: labels -> G: generated image).

Additionally, this process will use a causal graph to:

1. Capture dependence,
2. Capture causal effects.


Assuming a causal graph is given, generating images with mustache=1 would exclude women, creating a dataset without them.

### Intervention

Initially starting with an empty causal graph, fixing a specific label is termed as intervening. This may seem similar to conditioning but differs in influencing only the result elements and not the causal elements.

### Propose

The key is not just to sample from the probability distribution but also to consider conditional and interventional distributions. This involves a two-step training process. The first step uses WassersteinGAN for training a causal implicit generative model with respect to labels. In the second step, what we call a CausalGAN, a conditional GAN model is used. The first step is especially noteworthy for its graph-structured generative model, which produces binary labels highly concentrated around 0 and 1. This model was experimented with on the labeled CelebA dataset.

### Related Work

In related work, the first introduction is to GANs given labels, followed by the use of causal learning in deep learning. Also, the use of style-content disentanglement in SD-GAN was noted.

### Causaility Basics
(I apologize for some random Koreans starting from here. TBH this blog section is almost my personal archive so please judge too harshly🥲🥲)

Anyway, they first introduced the concept of SCM.

![1](/assets/posts/causalgan/1.png){: width='100%}
To elaborate, the causal sufficiency assumption, in other terms, states that every exogenous variable is at most the direct parent of one observable variable.

![2](/assets/posts/causalgan/2.png){: width='100%}
However, the discussion here points out that without additional assumptions, it's impossible to know the true causal graph. This is because many causal graphs can have the same joint probability distribution for a set of variables. This seems to be the identifiability issue that CausalVAE pointed out when criticizing CausalGANs.

CausalGANs, however, do not address this issue. Indeed, many previous works have suggested that when the true causal graph is unknown, any graph that can reflect the conditional independencies observed in the data (i.e., any Bayesian network) is acceptable.

### CausalGAN

This model involves two steps:
1. Causal Controller
2. CausalGAN


As I understand it, the Causal Controller uses a given true causal graph as a prior to receive an image as input and produce discrete labels. The architecture of the feedforward neural network itself represents the causal graph.

![1](/assets/posts/causalgan/3.png){: width='100%}

The CausalGAN then aims to generate realistic images conditioned on the labels created by the controller.

![1](/assets/posts/causalgan/4.png){: width='100%}

While CausalVAE focuses on creating causally disentangled representations, this approach is quite different.

The image below shows the experimental results.

![1](/assets/posts/causalgan/5.png){: width='100%}