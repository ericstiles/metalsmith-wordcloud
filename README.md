[![Build Status](https://travis-ci.org/ericstiles/metalsmith-wordcloud.svg?branch=master)](https://travis-ci.org/ericstiles/metalsmith-wordcloud)
# MetalSmith-WordCloud

A [metalsmith](https://github.com/segmentio/metalsmith) plugin that creates an array of weighted values for use in a word cloud.

This plugin needs to be used in conjunction with [metalsmith-tags](https://github.com/totocaster/metalsmith-tags) as the path for the cloud category can used to point to the html page listing of related articles.  The metalsmith-tags plugin takes the string list of categories/tags and converts them to an array of values.  The metalsmith-cloud plugin is dependent on this array that exists in each file object.

Cloud tags are sorted alphanumerically by tag name.

## Installation

    $ npm install metalsmith-cloud --save-dev

## CLI Usage

  Install the node modules and then add the `metalsmith-tags` key to your `metalsmith.json` plugins. The simplest use case just requires tag handle you want to use:

```json
{
  "plugins": {
    "metalsmith-cloud": {
      "handle": "tags",
      "path": "topics/:tags/index.html",
      "reverse": true
    }
  }
}
```

## Javascript Usage

  Pass the plugin to `Metalsmith#use`:

```js
var tags = require('metalsmith-tags'),
wordcloud = require('metalsmith-cloud');

metalsmith
    .use(tags({
        handle: 'tags',
        path: 'topics/:tags/index.html',
        template: '/partials/tag.hbt'
    }))
    .use(wordcloud({
        category: 'tags', //optional, default is tags
        reverse: false, //optional sort value on category, default is false
        path: 'topics/:tags/index.html'  // according to the path of metalsmith-tags
    }))
```

## Usage

### Under The Covers
A property key 'cloud' is added to the metadata containing a sorted array of objects with 'name', 'slug', 'weight' and 'path' keys.

```js
  { cloud: [
    { name: 'aws',  slug: 'aws',  weight: 1, path: 'topics/aws/index.html' },
    { name: 'bash', slug: 'bash', weight: 1, path: 'topics/bash/index.html' },
    { name: 'blog', slug: 'blog', weight: 2, path: 'topics/blog/blog.html' }
  ] }
```

### Application

Using [handlebars](http://handlebarsjs.com/) the following example creates links for each category.

    {{#each cloud}}
        <a href="/{{this.path}}">
            {{this.name}}({{this.weight}})
        </a>
    {{/each}}

where the html built would be as follows:

```html
    <a href="/topics/aws/index.html">aws(1)</a>
    <a href="/topics/bash/index.html">bash(1)</a>
    <a href="/topics/blog/index.html">blog(1)</a>
```

There are several implementations for creating word clouds.  http://ericstiles.github.io uses [jquery.tagcloud.js](https://github.com/addywaddy/jquery.tagcloud.js) to create a wordcloud on the site.
