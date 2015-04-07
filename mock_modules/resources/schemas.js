/**
 * Created by Paul on 2015/03/23.
 */
exports = module.exports = function(conn) {
    var mongoose = conn.mongoose;

    var schemas = {};

    schemas.resourceSchema = mongoose.Schema({

        file_name: String,
        data: Buffer,
        hidden: Boolean,
        post_id: Number
    }, {collection: 'Resources'});

    schemas.constraintSchema = mongoose.Schema({

        mime_type: String,
        size_limit: Number
    }, {collection: 'Resource_Constraints'});

    return schemas;
};