# Image Input Preview ([Demo](https://jsfiddle.net/Zenoo0/y8v52wpd/))

Display a preview for your image inputs easily

### Doc

* **Installation**

Simply import image-input-preview into your HTML.
```
<link rel="stylesheet" type="text/css" href="https://gitcdn.link/repo/Zenoo/image-input-preview/master/ImageInputPreview.min.css">
<script src="https://gitcdn.link/repo/Zenoo/image-input-preview/master/ImageInputPreview.min.js"></script>	
```
* **Documentation**

See the offical [documentation](https://zenoo.github.io/image-input-preview/ImageInputPreview.html) for more in-depth informations.

* **How to use**

You can either use data attributes or the `ImageInputAttribute` class to initialyze your inputs:
```
<input type="file" accept="image/*" data-preview="https://link.to.your.preview.net">
// OR
let preview = new ImageInputPreview(input, {
  preview: 'https://link.to.your/preview.png',        // Optional | Preview displayed
  uploadIcon: 'https://link.to.your.upload/icon.png', // Optional | Icon used when no preview is displayed
  lang: 'en',                                         // Optional | Language used
  dictionary: null                                    // Optional | Allow for custom language
});
```

* **Methods**

See the [documentation](https://zenoo.github.io/image-input-preview/ImageInputPreview.html) for the method definitions.


* **Example**

See this [JSFiddle](https://jsfiddle.net/Zenoo0/y8v52wpd/) for a working example

## Authors

* **Zenoo** - *Initial work* - [Zenoo.fr](http://zenoo.fr)
