# NLP Image search

### Problems you might encounter after cloning the repository
Some files are not checked in because they were quite big. The directory Structure file "dirStructure.txt" will help you to see which folders are missing.

### Problems during deployment
The server might not recognize the packages if you run from inside the "liir_image_search" folder. In that case add these lines on top of 
__init.py__ file.

```
import os,sys
sys.path.append("/home/muse/multimodal_search/NLPImageSearch")
```

Also the run the server as a background process which runs even if you close the shell. e.g.

```
$ nohup python __init.py__ &
```

### Extending the functionalities on server side
For adding the 'Find similar images' functionality you will have to send a response object of the form given in the file "findSimilarImagesResponseObject.JPG".

### Changing Log levels
By default we use log level INFO. A good idea while debugging will be to change it to DEBUG and bump the server.

### Changing configuration
For changing location of DB file, port of our service etc etc. the "config.json" file is used. You will have to bump the server after changing it.

### Changing lables
For changing labels in the webapp refer to "labels.json". Bump the server to see the changes taking effect.


