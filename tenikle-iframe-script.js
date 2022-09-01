(function () {
    initialize();

    function initialize() {
        const promise1 = new Promise((resolve, reject) => {
            createStyleSheet();
            resolve('Success!');
        });
        promise1.then((value) => {
            createIFrame();
        });
    };

    
    function createStyleSheet() {
        jQuery.get("https://uploads-ssl.webflow.com/62eca35217fa63e7178111ad/630f47b6741decd8577efd80_teniklesStyles.txt", function (data) {
            var sheet = $('<style></style>')
            $('head').append(sheet)
            sheet.append(data);
        })
    };
 
    function createIFrame() {
        jQuery.get("http://localho.st:8080/tenikle-iframe.txt", function (data) {
            var iframe = document.createElement("iframe");
            iframe.setAttribute("tabindex", "0");
            iframe.setAttribute("name", "frame");
            iframe.setAttribute("id", "myIframe");
            iframe.setAttribute("data-hj-allow-iframe", "true");
            iframe.setAttribute("src", "http://localho.st:8080/tenikle-iframe.html");
            iframe.setAttribute("style", "display: block; width: 100%; height: 100%; position: fixed; inset: 0px; z-index: 2147483647; border: none;display:none");
            iframe.innerHTML = data;
            iframe.src = 'data:text/html,' + encodeURIComponent(data);

            const promise1 = new Promise((resolve, reject) => {
                document.body.appendChild(iframe);

                resolve('Success!');
            });

            promise1.then((value) => {
                console.log(value);
                // expected output: "Success!"
                setupModal();
            });
        });
    };
})();