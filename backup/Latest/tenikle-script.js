// IFRAME script
(function () {

    initialize();
    async function initialize() {
        createModal(await createIFrame());
    }

    function createIFrame() {
        return new Promise((resolve) => {
            try {
                jQuery.get("https://uploads-ssl.webflow.com/62eca35217fa63e7178111ad/6310b9c5801479cbe2b7dfe6_tenikle-iframe.txt", function (data) {
                    var iframe = document.createElement("iframe");
                    iframe.setAttribute("tabindex", "0");
                    iframe.setAttribute("name", "frame");
                    iframe.setAttribute("id", "myIframe");
                    iframe.setAttribute("data-hj-allow-iframe", "true");
                    iframe.setAttribute("style", "display: block; width: 100%; height: 100%; position: fixed; inset: 0px; z-index: 2147483647; border: none;display:none");
                    iframe.innerHTML = data;
                    iframe.src = 'data:text/html,' + encodeURIComponent(data);
                    document.body.appendChild(iframe);

                    resolve('Success!');
                });
            }
            catch (ex) {
                alert('createIFrame EXCEPTION: ' + ex);
            }
        });
    };

    function createModal() {
        try {
            // Get the <span> element that closes the modal
            // When the user clicks on <span> (x), close the modal
            let btnClose = $('#myIframe').contents().find('#btnClose')
            btnClose.onclick = function () {
                iframeDocument.style.display = "none";
            };

            // Get the continue button
            // when the user clicks the continue button, redirect to checkout
            let btnContinue = $('#myIframe').contents().find('#btnClose')
            btnContinue.onclick = function () {
                window.location.replace("https://www.tenikle.com/cart")
            }

            // Get the add button
            // When the user clicks the add button, add item to cart
            let btnAdd = $('#myIframe').contents().find('#btnAdd')
            btnAdd.onclick = function () {
                let $productId = iframeWindow.document.getElementById('productId');
                let $variantId = iframeWindow.document.getElementById('productVariants1');
                let $quantity = iframeWindow.document.getElementById('variantQuantity');

                let productId = $productId.innerHTML;
                let variantId = $variantId.selectedOptions[0].value;
                let quantity = parseInt($quantity.value);

                const client = ShopifyBuy.buildClient({
                    domain: shopifyDomain,
                    storefrontAccessToken: 'f4b463a7038ebe9367370e6e50c04b5e',
                })

                client.product.fetch(btoa(productId)).then((product) => {
                    product.variants.forEach((variant) => {
                        if (variant.id == variantId) {
                            product.selectedQuantity = quantity;
                            updateCart(productId, variantId, quantity);
                        }
                    });
                });
            };

            // When the user clicks anywhere outside of the modal, close it
            let modal = $('#myIframe').contents().find('#myModal')
            window.onclick = function (event) {
                if (event.target == modal) {
                    iFrame.style.display = "none";
                }
            };
        }
        catch (err) {
            alert(err);
        }
    }
})();