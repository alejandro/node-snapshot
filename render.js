var page = new WebPage();
page.viewportSize = { width: 320, height: 480 };

page.open(phantom.args[0], function (status) {
    if (status !== 'success') {
        console.log('Unable to access the network!');
    } else {
        page.evaluate(function () {});
        page.render('./render/' + phantom.args[1] + '.png');
    }
    phantom.exit();
});
