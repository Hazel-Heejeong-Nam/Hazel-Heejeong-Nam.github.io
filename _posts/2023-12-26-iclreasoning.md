---
title: "[Paper] Can In-context Learners Learn a Reasoning Concept
from Demonstrations?"
layout: post
post-image: "/assets/posts/iclreasoning/thumb.png"
description: 
tags:
    Large Language Models
    Reasoning
    In-context Learning
---
### Abstract
- ICL largely rely on pre-trained knowledge.
- Thus using randomly selected demonstrations are not enough to teach information beyond simple input-output relationship. (such as reasoning)
- Propose a concept-sharing method. (to evaluate models' ability independent of models' memory.)
  - Extract the set of concepts 
  - show how beneficial these are. 
- Most cannot benefit from the concepts.

### Introduction
- ICL learns input-output examples of the task.
- But super sensitive and somewhat mysterious
  - to the ordering of demonstrations
  - to the specific wording
  - persistant performance even when the contents of the demonstrations are randomly swapped
  - over-relying on semantics of the label tokens

- Why?
  - Open-ended tasks, which are used to evaluate ICL, rarely present a reasoning case.
  - Thus often cannot evaluate *LEARNING* skill.

- While models with large capacity of demonstrations often benefit from the larger number of demonstrations, it doesn't mean that those are better at *LEARNing* from the concept. (prone to adversaries)

- To overcome existing evaluation methods, they tried to measure how well can the ICL utilize identified concepts. 

### Problem Definition
- What we exepct from ICL?
    1. Identifying relationship of demonstrations
    2. Applying those relationships to the test case.

- Relationship can be modelled by one or more concepts $C$. 

\[\forall (x_i, Y_i) \in D  : \exists C : C(x_i,Y_i)=1\]

*Here, concept $C$ constrains a space of valid output. i.e. if $C$ is well learned, it will never predict for $x$ such $y$ that $C(x,y)=0$*


### Concept-sharing Few-shot Learning

So, this paper conduct experiement by allowing the same concept shared, but other features are also allowed since such reliance is not easy. 

Also, they compared randomly selected demonstrations and concept-sharing demonstrations with the same predicted samples. 

### Selecting concepts
Concepts were collected from human explanations

### Experiments
- Models : T0, Tk-instruct, Flan, GPT3
- Dataset : WorldTree, OpenBookQA, HotpotQA, GLUE Diagnostic

### Results
- Concept learning has almost nothing to do with the model size. 
- Evaluated concepts are informative at least one model.
  

