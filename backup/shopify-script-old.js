var scriptURL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
const shopifyDomain = 'tenikle.myshopify.com';
const iframe = document.getElementById('myIframe');
const iframeWindow = iframe.contentWindow;

if (window.ShopifyBuy) {
    if (window.ShopifyBuy.UI) {
        ShopifyBuyInit();
    } else {
        loadScript();
    }
} else {
    loadScript();    
}

function loadScript() {
    var script = document.createElement('script');
    script.async = true;
    script.src = scriptURL;
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);
    script.onload = ShopifyBuyInit;
}
function ShopifyBuyInit() {
    const client = ShopifyBuy.buildClient({
        domain: shopifyDomain,
        storefrontAccessToken: 'f4b463a7038ebe9367370e6e50c04b5e',
    });

    ShopifyBuy.UI.onReady(client).then(function (ui) {
        ui.createComponent('product', {
            id: 4958989615190,
            options: {
                product: {
                    buttonDestination: 'modal',
                    DOMEvents: {
                        'click .shopify-buy__btn': function (event) {                            
                            iframe.style.display = "block";
                        }
                    },
                    "buttonDestination": "checkout",
                },
                cart: {},
                modal: {},
                modalProduct: {},
                toggle: {},
            },
        })
    });

    setupModal();
    initialize(client);
}

function initialize(client)
{
    for (var checkoutId, key, i = 0; i < localStorage.length; ++i) {
        key = localStorage.key(i);
        if (key.match(shopifyDomain + '.checkoutId')) {
            checkoutId = localStorage.getItem(key);
        }
    }

    let $productName = iframeWindow.document.getElementById('productName');
    let $productPrice = iframeWindow.document.getElementById('productPrice');
    let $productImage = iframeWindow.document.getElementById('productImage');

    let $productNameUpsell = iframeWindow.document.getElementById('productNameUpsell');
    let $productImageUpsell = iframeWindow.document.getElementById('productImageUpsell');
    let $productPriceUpsell = iframeWindow.document.getElementById('productPriceUpsell');
    let $productPriceBeforeDiscount = iframeWindow.document.getElementById('productPriceBeforeDiscount');

    let $productVariants1 = iframeWindow.document.getElementById('productVariants1');
    let $productVariants2 = iframeWindow.document.getElementById('productVariants2');

    let productId = 'gid://shopify/Product/4958989615190'

    client.product.fetch(productId).then((product) => {
        $productNameUpsell.innerHTML = product.title;
        $productImageUpsell.innerHTML = '<img src="' + product.images[0].src + '" alt="Product" class="h-mobileImageSmall md:h-desktopImageSmall w-mobileImageSmall md:w-desktopImageSmall object-scale-down">';
        $productPriceBeforeDiscount.text = '$ ' + Number(product.attrs.variants[00].priceV2.amount).toFixed(2) + ' ' + product.attrs.variants[00].priceV2.currencyCode;

        let productVariant = '';
        product.variants.forEach((variant) => {
            if (variant.available) {
                productVariant += '<option value="' + (variant.id) + '">' + variant.title + '</option>';
            }
        });

        $productVariants1.innerHTML = '<select id=variants1 class="appearance-none py-8 px-10 bg-white text-md w-full border bg-no-repeat pointer:text-md-mobile pr-25 truncate cursor-pointer">' + productVariant + '</select>';
        $productVariants2.innerHTML = '<select id=variants2 class="md:hidden appearance-none py-8 px-10 bg-white text-md w-full border bg-no-repeat pointer:text-md-mobile pr-25 truncate cursor-pointer">' + productVariant + '</select>';
    });

    if (checkoutId != null) {
        client.checkout.fetch(checkoutId).then((checkout) => {
            $total = checkout.subtotalPrice;

            const discountCode = 'CANDYRACK-W7OJZQP91P';
            if (checkout.discountApplications.length = 0) {
                // Add a discount code to the checkout            
                client.checkout.addDiscount(checkoutId, discountCode).then(checkout => {
                    // Do something with the updated checkout
                    console.log(checkout);
                })
            };

            checkout.lineItems.forEach((lineItem) => {
                console.log(lineItem.variant.available);
                $productName.innerHTML = lineItem.title;
                $productPrice.text = '$ ' + Number(lineItem.variant.priceV2.amount).toFixed(2) + ' ' + lineItem.variant.priceV2.currencyCode;
                $productImage.innerHTML = '<img src="' + lineItem.variant.image.src + ' alt="Product" class="block w-50 h-50 object-cover"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="100%" height="100%" class="animated-checkmark--finished absolute top-0 rounded-full block stroke-5 stroke-white z-20 -mt-8 -mr-8 right-0 w-15 h-15"><circle class="checkmark__circle stroke-2 stroke-green" cx="26" cy="26" r="25" fill="none"></circle><path class="checkmark__check origin-center" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"></path></svg>';

                lineItem.discountAllocations.forEach((discountAllocation) => {
                    console.log(discountAllocation.allocatedAmount.amount)
                    $productPriceUpsell.text('$ ' + Number(lineItem.variant.priceV2.amount - discountAllocation.allocatedAmount.amount).toFixed(2) + ' ' + discountAllocation.allocatedAmount.currencyCode);
                })
            })
        })
    };    
}

function setupModal() {
    // Get the <span> element that closes the modal
    var btnCloseModal = iframeWindow.document.getElementById('btnClose');

    // Get the continue button
    let btnContinue = iframeWindow.document.getElementById('btnContinue');

    // Get the sff button
    let btnAdd = iframeWindow.document.getElementById('btnAdd');

    // When the user clicks anywhere outside of the modal, close it
    let modal = document.getElementById('myMain');
    window.onclick = function (event) {
        if (event.target == modal) {
            iFrame.style.display = "none";
        }
    };

    // When the user clicks the add button
    btnCloseModal.onclick = function () {
        addItemToCart();
    };

    // when the user clicks the continue button, redirect to checkout
    btnContinue.onclick = function () {
        window.location.replace("https://www.tenikle.com/cart")
    }

    // When the user clicks on <span> (x), close the modal
    btnCloseModal.onclick = function () {
        iframe.style.display = "none";
    };
}

function addItemToCart() {    
    var variant = iframeWindow.document.getElementById("productVariants1");
    var productId = variant.value;
    var variantTitle = variant.options[variant.selectedIndex].text;
    var variantQuantity = parseInt(iframeWindow.document.getElementById("variantQuantity").value);

    const client = ShopifyBuy.buildClient({
        domain: shopifyDomain,
        storefrontAccessToken: 'f4b463a7038ebe9367370e6e50c04b5e',
    })

    for (var checkoutId, key, i = 0; i < localStorage.length; ++i) {
        key = localStorage.key(i); if (key.match(shopifyDomain + '.checkoutId')) {
            checkoutId = localStorage.getItem(key);
        }
    }

    if (checkoutId == null) {
        // Create an empty checkout
        client.checkout.create().then((checkout) => {
            checkoutId = checkout.id;

            // Add an item to the checkout
            let lineItemsToAdd = [
                {
                    variantId: btoa(productId),
                    quantity: variantQuantity
                }
            ];

            client.checkout.addLineItems(checkoutId, lineItemsToAdd).then((checkout) => {
                // Do something with the updated checkout
                console.log(checkout.lineItems); // Array with one additional line item
            });            
        });
    }    
}

