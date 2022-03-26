
Implemention images comparison with the pixelmatch algorithm, using all the capabilities of the workers with capabilities:

1. interface of the form (image1, image2) => result, where image1 and image2 are images in the form of an array of points of the format (R,G,B,A), and result is either true if the images are identical, or false if they have the sizes differ, or the number of different pixels, if the pictures differ from each other, but have the same width and height;
2. caching the results of comparing images with saving the cache when the browser is restarted;
3. comparison of images in additional threads (the number of computational threads should not exceed the number of processor cores) that do not block the processing of the queue of images for comparison;
3. the cache must exist in a single instance, regardless of the number of contexts from which the comparison function is called;
4. calling the comparison function should not increase memory consumption due to the serialization of pictures when transferring between workers. 

![image](https://user-images.githubusercontent.com/8277597/160229888-86c90362-e0a1-4064-a80e-c28189bb12f6.png)
