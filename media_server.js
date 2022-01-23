require('./models/user');
var User = require('mongoose').model('User');
const NodeMediaServer = require('node-media-server');
const config = require('./config/default').rtmp_server;
const helpers = require('./helpers/helper');
nms = new NodeMediaServer(config);


nms.on('prePublish', async (id, StreamPath, args) => {
    let streamKey = getStreamKeyFromStreamPath(StreamPath);
    console.log(streamKey);
    console.log('[NodeEvent on prePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
    User.findOne({stream_key: streamKey}, (err, user) => {
        if(!err) {
            if(!user) {
                let session = nms.getSession(id);
                session.reject();
            }
            else {
                helpers.generateStreamThumbnail(streamKey);
            }
        }
    });
});
 
const getStreamKeyFromStreamPath = (path) => {
    let parts = path.split('/');
    return parts[parts.length - 1];
};

 
module.exports = nms;