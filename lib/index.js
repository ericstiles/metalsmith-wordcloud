var _ = require('underscore');
/**
 * Expose `plugin`.
 */

module.exports = plugin;

/**
 * Metalsmith plugin to create a sorted weighted list of articles categories/tags based
 *
 * @param {String or Object} options
 * @property {String} categories (optional) Default is 'tags'.  Tell plugin which property to pull to get data
 * @property {boolean} reverse Should the category sort be reversed.  Default is false, thus sort is descending alphanumeric
 * @return {Function} plugin function that is run by metalsmith
 */
function plugin(opts) {
    opts = opts || {};
    var category = opts.category || 'tags';
    // var cloud = opts.name || 'cloud';
    // var sort = opts.sort || 'key';
    var reverse = opts.reverse || false;
    var path = opts.path || 'tags/:tag/index.html';
    /**
     * Given an oject literal, and boolean value return a sorted array of those key values.
     * @param  {[type]} obj     [description]
     * @param  {[type]} reverse [description]
     * @return {[type]}         [description]
     */
    function sortKeys(obj, reverse) {
        if (reverse) return _.keys(obj).sort().reverse();
        return _.keys(obj).sort();
    }
    /**
     * Return an array of weighted categories including the categories
     * @param {[type]} sortedArray sorted Array of category values
     * @param {[type]} map         map of weighted tags
     */
    function addKeyValues(sortedArray, map, tags) {
        var responseObj = [];
        _.each(sortedArray, function(value) {
            var tag = tags.find(function (obj) {
                  return obj.slug === value;
                }),
                weightedCategory = {
                    name: tag.name,
                    slug: tag.slug,
                  weight: map[value],
                    path: path.replace(/:tag/g, tag.slug)
                };
            responseObj.push(weightedCategory);
        });
        return responseObj;
    }
    /**
     * returned function called by MetalSmith to implement plugin
     * @param  {[type]}   files      list of html pages created from markdown
     * @param  {[type]}   metalsmith primary object for managing workflow
     * @param  {Function} done       function called to exit plugin and return control to parent
     * @return {[type]}              function to be called to complete plugin work
     */
    return function(files, metalsmith, done) {
        var metadata = metalsmith.metadata();

        //composed functions that need to be applied to the files provided
        //to get a weighted list of categories
        var occurences = _.compose(
              _.flatten,
              _.compact,
              function(values) {
                return _.pluck(values, category);
              },
              _.values
            )(files),
            weightedList = _.countBy(occurences, function(tag) {
              return tag.slug;
            });
        metadata.cloud = addKeyValues(sortKeys(weightedList, reverse), weightedList, occurences) || [];
        done();
    };
}
