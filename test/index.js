var assert = require('assert'),
    equal = require('assert-dir-equal'),
    tags = require('..'),
    cloud = require('../lib/index.js');

//mock metalsmith object
var metalsmith = {
    data: {
        "dir": "/Users/ericstiles/repo/metalsmith-wordcloud",
        "ware": {
            "fns": [null, null]
        },
        "data": {},
        "_src": "src",
        "_dest": "build",
        "_clean": true,
        "_frontmatter": true
    },
    metadata: function() {
        return this.data;
    }
};

//expected return array when no values provided to plugin 
//and default values are used
var expected_cloud_default_values = [{
    name: 'cat1',
    slug: 'cat1',
    weight: 1,
    path: 'tags/cat1/index.html'
}, {
    name: 'cat2',
    slug: 'cat2',
    weight: 1,
    path: 'tags/cat2/index.html'
}, {
    name: 'cat3',
    slug: 'cat3',
    weight: 2,
    path: 'tags/cat3/index.html'
}];
//expected return array when values provided to plugin
var expected_cloud_provided_values = [{
    name: 'cat1',
    slug: 'cat1',
    weight: 1,
    path: '/topics/cat1'
}, {
    name: 'cat2',
    slug: 'cat2',
    weight: 1,
    path: '/topics/cat2'
}, {
    name: 'cat3',
    slug: 'cat3',
    weight: 2,
    path: '/topics/cat3'
}];
// Mock file array
var files = {
    "content/posts/a.html": {
        "title": "title-one",
        "date": "2013-04-01T00:00:00.000Z",
        "tags": [{ name: "cat1", slug: "cat1" }],
        "template": "blog.hbt",
        "contents": [60, 112, 62, 116, 105, 116, 108, 101, 45, 111, 110, 101, 60, 47, 112, 62, 10],
        "mode": "0644"
    },
    //Notice a bug in the metalsmith-tags plugin that creates in an empty array.  Underscore
    //appears to take care of this issue.
    "content/posts/b.html": {
        "title": "title-two",
        "date": "2013-04-01T00:00:00.000Z",
        "tags": [{ name: "cat2", slug: "cat2" },{ name: "cat3", slug: "cat3" }],
        "template": "blog.hbt",
        "contents": [60, 112, 62, 116, 105, 116, 108, 101, 45, 116, 119, 111, 60, 47, 112, 62, 10],
        "mode": "0644"
    },
    "content/posts/c.html": {
        "title": "title-three",
        "date": "2013-04-01T00:00:00.000Z",
        "tags": [{ name: "cat3", slug: "cat3" }],
        "template": "blog.hbt",
        "contents": [60, 112, 62, 116, 105, 116, 108, 101, 45, 116, 104, 114, 101, 101, 60, 47, 112, 62, 10],
        "mode": "0644"
    },
    "content/posts/e.html": {
        "title": "title-five",
        "date": "2013-04-01T00:00:00.000Z",
        "tags": [],
        "template": "blog.hbt",
        "contents": [60, 112, 62, 116, 105, 116, 108, 101, 45, 102, 105, 118, 101, 60, 47, 112, 62, 10],
        "mode": "0644"
    },
    "content/posts/d.html": {
        "title": "title-four",
        "date": "2013-04-01T00:00:00.000Z",
        "template": "blog.hbt",
        "contents": [60, 112, 62, 116, 105, 116, 108, 101, 45, 102, 111, 117, 114, 60, 47, 112, 62, 10],
        "mode": "0644"
    },
    "topics/cat1.html": {
        "template": "/partials/tag.hbt",
        "mode": "0644",
        "contents": "",
        "tag": "cat1",
        "posts": [{
            "title": "title-one",
            "date": "2013-04-01T00:00:00.000Z",
            "tags": "cat1",
            "template": "blog.hbt",
            "contents": [60, 112, 62, 116, 105, 116, 108, 101, 45, 111, 110, 101, 60, 47, 112, 62, 10],
            "mode": "0644"
        }]
    },
    "topics/cat2.html": {
        "template": "/partials/tag.hbt",
        "mode": "0644",
        "contents": "",
        "tag": "cat2",
        "posts": [{
            "title": "title-two",
            "date": "2013-04-01T00:00:00.000Z",
            "tags": "cat2,cat3",
            "template": "blog.hbt",
            "contents": [60, 112, 62, 116, 105, 116, 108, 101, 45, 116, 119, 111, 60, 47, 112, 62, 10],
            "mode": "0644"
        }]
    },
    "topics/cat3.html": {
        "template": "/partials/tag.hbt",
        "mode": "0644",
        "contents": "",
        "tag": "cat3",
        "posts": [{
            "title": "title-two",
            "date": "2013-04-01T00:00:00.000Z",
            "tags": "cat2, cat3",
            "template": "blog.hbt",
            "contents": [60, 112, 62, 116, 105, 116, 108, 101, 45, 116, 119, 111, 60, 47, 112, 62, 10],
            "mode": "0644"
        }, {
            "title": "title-three",
            "date": "2013-04-01T00:00:00.000Z",
            "tags": "cat3",
            "template": "blog.hbt",
            "contents": [60, 112, 62, 116, 105, 116, 108, 101, 45, 116, 104, 114, 101, 101, 60, 47, 112, 62, 10],
            "mode": "0644"
        }]
    },
    "topics/.html": {
        "template": "/partials/tag.hbt",
        "mode": "0644",
        "contents": "",
        "tag": "",
        "posts": [{
            "title": "title-two",
            "date": "2013-04-01T00:00:00.000Z",
            "tags": "cat2, cat3",
            "template": "blog.hbt",
            "contents": [60, 112, 62, 116, 105, 116, 108, 101, 45, 116, 119, 111, 60, 47, 112, 62, 10],
            "mode": "0644"
        }]
    }
};
//Mock metalsmith done function called when plugin finishes.
var testDone = function() {};

describe('metalsmith-cloud using default options by not providing an options parameter', function() {
    it('should create a new key in metadata object for a sorted array of weighted categories with links', function(done) {
        var plugin = cloud();
        plugin(files, metalsmith, testDone);
        assert.notEqual(metalsmith.metadata().cloud, undefined, "cloud key doesn't exist in metadata");
        assert.deepEqual(metalsmith.metadata().cloud, expected_cloud_default_values);
        done();
    });
});

describe('metalsmith-cloud using user provided configurations', function() {
    it('should create a new key in metadata object for a sorted array of weighted categories with links', function(done) {
        var plugin = cloud({
            category: 'tags',
            reverse: false, //default is false
            path: '/topics/:tag'
        });
        plugin(files, metalsmith, testDone);
        assert.notEqual(metalsmith.metadata().cloud, undefined, "cloud key doesn't exist in metadata");
        assert.deepEqual(metalsmith.metadata().cloud, expected_cloud_provided_values);
        done();
    });
});
