# ISH_CompSci_NNTool

Calling autorecord runs the training, testing and write to JSON. It automatically completes a set number of trials.

variations is an array of the different sample sizes. [[(SampleSize1) [No. rectangles, No. Circles, No. Triangles],[(SampleSize2) [No. rectangles, No. Circles, No. Triangles]],...]
trials is the number of trials the program needs to run (Default 3)
test_size is the number of each shape to test on (The total size of the training dataset, with all shapes, is test_size * 3)
randomize enables the shuffling of the training data. It removes the rectangle (The last batch of shapes) overfit.

Documentation on the investigation: https://docs.google.com/document/d/1HZLcWjyIplNWvR5LCi1_EM4CD06GPjwfy64Cr5lVvoU/edit?usp=sharing

The python code was a very quick and dirty way to average all the values and present them. The code is not well made and not futureproof, I might improve it later.
