var assert = require("assert");
var request = require("request");

require("../server");

// describe("Server", function() {
//     it("responds with JSON message 'Hello, World!' at the root", function(done) {
//         request("http://localhost:8080/hello", function(err, response, body) {
//             if (err) done(err);
//             var payload = JSON.parse(body);
//             assert.equal(response.statusCode, 200);
//             assert.equal(payload.message, "Hello, World!");
//             done();
//         });
//     });
// });


describe("get /api/users", function() {
    it("responds with users data, who have not filled taxfile", function(done) {
        request("http://localhost:8080/api/users", function(err, response, body) {
            if (err) done(err);
            var payload = JSON.parse(body);
            var data = true;
            for (var i of payload) {
            	if (i.taxfile) {
            		data = false;
            		break;
            	}
            }
            assert.equal(response.statusCode, 200);
            assert.equal(data, true);
            done();
        });
    });
});