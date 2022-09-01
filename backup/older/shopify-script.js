var scriptURL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
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
                            var modal = document.getElementById("myModal");
                            modal.style.display = "block";
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

    for (var checkoutId, key, i = 0; i < localStorage.length; ++i) {
        key = localStorage.key(i); if (key.match(shopifyDomain + '.checkoutId')) {
            checkoutId = localStorage.getItem(key);
        }
    }

    let $productName = $('#productName');
    let $productPrice = $('#productPrice');
    let $productImage = $('#productImage');

    let $productNameUpsell = $('#productNameUpsell');
    let $productImageUpsell = $('#productImageUpsell');
    let $productPriceUpsell = $('#productPriceUpsell');
    let $productPriceBeforeDiscount = $('#productPriceBeforeDiscount');

    let $productVariants1 = $('#productVariants1');
    let $productVariants2 = $('#productVariants2');

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
            $productName.html(lineItem.title);
            $productPrice.text('$ ' + Number(lineItem.variant.priceV2.amount).toFixed(2) + ' ' + lineItem.variant.priceV2.currencyCode);
            $productImage.html('<img src="' + lineItem.variant.image.src + ' alt="Product" class="block w-50 h-50 object-cover"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="100%" height="100%" class="animated-checkmark--finished absolute top-0 rounded-full block stroke-5 stroke-white z-20 -mt-8 -mr-8 right-0 w-15 h-15"><circle class="checkmark__circle stroke-2 stroke-green" cx="26" cy="26" r="25" fill="none"></circle><path class="checkmark__check origin-center" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"></path></svg>');

            lineItem.discountAllocations.forEach((discountAllocation) => {
                console.log(discountAllocation.allocatedAmount.amount)
                $productPriceUpsell.text('$ ' + Number(lineItem.variant.priceV2.amount - discountAllocation.allocatedAmount.amount).toFixed(2) + ' ' + discountAllocation.allocatedAmount.currencyCode);
            })
        })
    });

    let productId = 'gid://shopify/Product/4958989615190'
    client.product.fetch(productId).then((product) => {
        $productNameUpsell.html(product.title);
        $productImageUpsell.html('<img src="' + product.images[0].src + '" alt="Product" class="h-mobileImageSmall md:h-desktopImageSmall w-mobileImageSmall md:w-desktopImageSmall object-scale-down">');
        $productPriceBeforeDiscount.text('$ ' + Number(product.attrs.variants[00].priceV2.amount).toFixed(2) + ' ' + product.attrs.variants[00].priceV2.currencyCode);

        let productVariant = '';
        product.variants.forEach((variant) => {
            if (variant.available) {
                productVariant += '<option value="' + (variant.id) + '">' + variant.title + '</option>';
            }
        });

        $productVariants1.html('<select id=variants1 class="appearance-none py-8 px-10 bg-white text-md w-full border bg-no-repeat pointer:text-md-mobile pr-25 truncate cursor-pointer">' + productVariant + '</select>');
        $productVariants2.html('<select id=variants2 class="md:hidden appearance-none py-8 px-10 bg-white text-md w-full border bg-no-repeat pointer:text-md-mobile pr-25 truncate cursor-pointer">' + productVariant + '</select>');
    });
}

const shopifyDomain = 'tenikle.myshopify.com';
setupModal.call();

function setupModal() {
    // Get the modal
    let modal = document.getElementById("myModal");

    // Get the button that opens the modal
    let btnShowModal = document.getElementById("btnShow");

    // Get the <span> element that closes the modal
    let btnCloseModal = document.getElementById("btnClose");

    // Get the continue button
    let btnContinue = document.getElementById('btnContinue');

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
    
    // when the user clicks the continue button, redirect to checkout
    btnContinue.onclick = function () {
        window.location.replace("https://www.tenikle.com/cart")
    }
    
    // When the user clicks on <span> (x), close the modal
    btnCloseModal.onclick = function () {
        modal.style.display = "none";
    };    

    // When the user clicks on the button, open the modal
    btnShowModal.onclick = function () {
        modal.style.display = "block";
    };
    
}

function addItemToCart() {
    var variant = document.getElementById("variants1");
    var productId = variant.value;
    var variantTitle = variant.options[variant.selectedIndex].text;
    var variantQuantity = parseInt(document.getElementById("variantQuantity").value);

    const client = ShopifyBuy.buildClient({
        domain: shopifyDomain,
        storefrontAccessToken: 'f4b463a7038ebe9367370e6e50c04b5e',
    })

    for (var checkoutId, key, i = 0; i < localStorage.length; ++i) {
        key = localStorage.key(i); if (key.match(shopifyDomain + '.checkoutId')) {
            checkoutId = localStorage.getItem(key);
        }
    }

    // client.checkout.fetch(checkoutId).then((checkout) => {
    //     checkout.lineItems.forEach((lineItem) => {
    //         console.log(lineItem);

    //         let variantId = lineItem.variant.id;

    //         let lineItemIdsToRemove = [{
    //             id: btoa(variantId)
    //         }]

    //         client.checkout.removeLineItems(checkoutId, lineItemIdsToRemove).then((checkout) => {
    //             // Do something with the updated checkout
    //             console.log(checkout.lineItems); // Array with one additional line item
    //         });
    //     })
    // })    

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
}