const scriptURL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
const shopifyDomain = 'tenikle.myshopify.com';
const shopifyAccessToken = 'f4b463a7038ebe9367370e6e50c04b5e';

const _discountCode = 'CANDYRACK-W7OJZQP91P';
const _discountProductId = 'gid://shopify/Product/4958989615190';
let _checkoutId;

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
        storefrontAccessToken: shopifyAccessToken,
    });

    ShopifyBuy.UI.onReady(client).then(function (ui) {
        ui.createComponent('product', {
            id: '4958989615190',
            node: document.getElementById('product-component-1660181892296'),
            moneyFormat: '%24%7B%7Bamount%7D%7D',
            options: {
                "product": {
                    "buttonDestination": 'cart',
                    "styles": {
                        "product": {
                            "@media (min-width: 601px)": {
                                "max-width": "calc(25% - 20px)",
                                "margin-left": "20px",
                                "margin-bottom": "50px"
                            }
                        },
                        "button": {
                            "font-family": "Montserrat, sans-serif",
                            "font-weight": "bold",
                            "font-size": "18px",
                            "padding-top": "17px",
                            "padding-bottom": "17px",
                            ":hover": {
                                "background-color": "#e63844"
                            },
                            "background-color": "#ff3e4b",
                            ":focus": {
                                "background-color": "#e63844"
                            },
                            "border-radius": "15px",
                            "padding-left": "87px",
                            "padding-right": "87px"
                        },
                        "quantityInput": {
                            "font-size": "18px",
                            "padding-top": "17px",
                            "padding-bottom": "17px"
                        }
                    },
                    "contents": {
                        "img": false,
                        "title": false,
                        "price": false
                    },
                    "text": {
                        "button": "Add to cart"
                    },
                    "googleFonts": [
                        "Montserrat"
                    ],
                    "events": {
                        afterInit: function () {
                            cart_get();
                            console.log('shopify-buy__btn listening');
                        },
                        addVariantToCart: function (product) {
                            console.log('addVariantToCart initiated');
                            discount_isEligible(client, _checkoutId, product.storefrontId).then(
                                (eligible) => {
                                    if (eligible) { discount_apply(client, _checkoutId, _discountCode); console.log('discount applied') }
                                    else { discount_clear(client, _discountCode); console.log('discount removed') }
                                },
                                () => { console.log('discount not applied') });

                            updateView(client, _checkoutId, product.storefrontId);
                            showModal(true);
                            console.log('shopify-buy__btn button clicked');
                        },
                        updateVariant: function (product) {
                            console.log('updateVariant initiated');
                            discount_isEligible(client, _checkoutId, product.storefrontId).then(
                                (eligible) => {
                                    if (eligible) { discount_apply(client, _checkoutId, _discountCode); console.log('discount applied') }
                                    else { discount_clear(client, _discountCode); console.log('discount removed') }
                                },
                                () => { console.log('discount not applied') })
                        },
                    },
                },
                "productSet": {
                    "styles": {
                        "products": {
                            "@media (min-width: 601px)": {
                                "margin-left": "-20px"
                            }
                        }
                    }
                },
                "modalProduct": {
                    "contents": {
                        "img": false,
                        "imgWithCarousel": true,
                        "button": false,
                        "buttonWithQuantity": true
                    },
                    "styles": {
                        "product": {
                            "@media (min-width: 601px)": {
                                "max-width": "100%",
                                "margin-left": "0px",
                                "margin-bottom": "0px"
                            }
                        },
                        "button": {
                            "font-family": "Montserrat, sans-serif",
                            "font-weight": "bold",
                            "font-size": "18px",
                            "padding-top": "17px",
                            "padding-bottom": "17px",
                            ":hover": {
                                "background-color": "#e63844"
                            },
                            "background-color": "#ff3e4b",
                            ":focus": {
                                "background-color": "#e63844"
                            },
                            "border-radius": "15px",
                            "padding-left": "87px",
                            "padding-right": "87px"
                        },
                        "quantityInput": {
                            "font-size": "18px",
                            "padding-top": "17px",
                            "padding-bottom": "17px"
                        }
                    },
                    "googleFonts": [
                        "Montserrat"
                    ],
                    "text": {
                        "button": "Add to cart"
                    }
                },
                "option": {
                    "styles": {
                        "label": {
                            "font-family": "Montserrat, sans-serif"
                        },
                        "select": {
                            "font-family": "Montserrat, sans-serif"
                        }
                    },
                    "googleFonts": [
                        "Montserrat"
                    ]
                },
                "cart": {
                    "styles": {
                        "button": {
                            "font-family": "Montserrat, sans-serif",
                            "font-weight": "bold",
                            "font-size": "18px",
                            "padding-top": "17px",
                            "padding-bottom": "17px",
                            ":hover": {
                                "background-color": "#e63844"
                            },
                            "background-color": "#ff3e4b",
                            ":focus": {
                                "background-color": "#e63844"
                            },
                            "border-radius": "15px"
                        }
                    },
                    "text": {
                        "total": "Subtotal",
                        "button": "Checkout"
                    },
                    "contents": {
                        "note": true
                    },
                    "popup": false,
                    "googleFonts": [
                        "Montserrat"
                    ],
                    "events": {
                        updateItemQuantity: function (cart) {
                            cart.lineItems.forEach((lineItem) => {
                                console.log('checking variant discount if applicable')
                                if (lineItem.variant.product.id == _discountProductId && lineItem.quantity < 2) {
                                    console.log('variant does not meet discount requirement');
                                    lineItem.discountAllocations.forEach((discountAllocation) => {
                                        console.log(discountAllocation);
                                        if (discountAllocation.discountApplication.code == _discountCode) {
                                            cart_get().then((checkoutId) => {
                                                client.checkout.removeDiscount(checkoutId)
                                                console.log('removed discount code');
                                            })
                                        }
                                    })
                                }
                                else {
                                    discount_clear(client, _checkoutId, _discountCode);

                                }
                            })
                        },
                    },
                },
                "toggle": {
                    "styles": {
                        "toggle": {
                            "font-family": "Montserrat, sans-serif",
                            "font-weight": "bold",
                            "background-color": "#ff3e4b",
                            ":hover": {
                                "background-color": "#e63844"
                            },
                            ":focus": {
                                "background-color": "#e63844"
                            }
                        },
                        "count": {
                            "font-size": "18px"
                        }
                    },
                    "googleFonts": [
                        "Montserrat"
                    ]
                }
            },
        });
        ui.createComponent('product', {
            id: '4958989615190',
            node: document.getElementById('product-component-1660181892297'),
            moneyFormat: '%24%7B%7Bamount%7D%7D',
            options: {
                "product": {
                    "buttonDestination": 'cart',
                    "styles": {
                        "product": {
                            "@media (min-width: 601px)": {
                                "max-width": "calc(25% - 20px)",
                                "margin-left": "20px",
                                "margin-bottom": "50px"
                            }
                        },
                        "button": {
                            "font-family": "Montserrat, sans-serif",
                            "font-weight": "bold",
                            "font-size": "18px",
                            "padding-top": "17px",
                            "padding-bottom": "17px",
                            ":hover": {
                                "background-color": "#e63844"
                            },
                            "background-color": "#ff3e4b",
                            ":focus": {
                                "background-color": "#e63844"
                            },
                            "border-radius": "15px",
                            "padding-left": "87px",
                            "padding-right": "87px"
                        },
                        "quantityInput": {
                            "font-size": "18px",
                            "padding-top": "17px",
                            "padding-bottom": "17px"
                        }
                    },
                    "contents": {
                        "img": false,
                        "title": false,
                        "price": false
                    },
                    "text": {
                        "button": "Add to cart"
                    },
                    "googleFonts": [
                        "Montserrat"
                    ],
                    "events": {
                        afterInit: function () {
                            cart_get();
                            console.log('shopify-buy__btn listening');
                        },
                        addVariantToCart: function (product) {
                            console.log('addVariantToCart initiated');
                            discount_isEligible(client, _checkoutId, product.storefrontId).then(
                                (eligible) => {
                                    if (eligible) { discount_apply(client, _checkoutId, _discountCode); console.log('discount applied') }
                                    else { discount_clear(client, _discountCode); console.log('discount removed') }
                                },
                                () => { console.log('discount not applied') });

                            updateView(client, _checkoutId, product.storefrontId);
                            showModal(true);
                            console.log('shopify-buy__btn button clicked');
                        },
                        updateVariant: function (product) {
                            console.log('updateVariant initiated');
                            discount_isEligible(client, _checkoutId, product.storefrontId).then(
                                (eligible) => {
                                    if (eligible) { discount_apply(client, _checkoutId, _discountCode); console.log('discount applied') }
                                    else { discount_clear(client, _discountCode); console.log('discount removed') }
                                },
                                () => { console.log('discount not applied') })
                        },
                    },
                },
            },
        });
    });
}

function showModal(isVisible) {
    let upsellModal = document.getElementById("upsellModal");
    upsellModal.hidden = !isVisible;

    let iframe = document.getElementsByName('frame-product-4958989615190');
    for (let i = 0; i < iframe.length; i++) {
        if (isVisible) {
            iframe[i].style.height = '108px';
        }
        else {
            iframe[i].style.height = '0px';
        }
    }
}


function cart_get() {
    return new Promise((resolve, reject) => {
        let isCartExist = false;
        for (var checkoutId, key, i = 0; i < localStorage.length; ++i) {
            key = localStorage.key(i);
            if (key.match(shopifyDomain + '.checkoutId')) {
                checkoutId = localStorage.getItem(key);
                isCartExist = true;
                _checkoutId = checkoutId;
                break;
            }
        }
        if (isCartExist) { console.log('found cart!');; resolve(checkoutId); } else { console.log('no cart found'); reject(); }
    })
}

function discount_isExist(client, checkoutId) {
    return new Promise((resolve, reject) => {
        client.checkout.fetch(checkoutId).then(
            (checkout) => {
                let isDiscountExist = false;
                if (checkout.discountApplications.length > 0) {
                    checkout.discountApplications.forEach((discountApplication) => {
                        if (discountApplication.discountCode == _discountCode) {
                            isDiscountExist = true;
                        }
                    });
                    if (isDiscountExist) { console.log('discount already in cart '); resolve(); }
                    else { console.log('discount not  in cart'); reject(); }
                }
                else { console.log('discount not  in cart'); reject(); }
            },
            () => { console.log('unable to fetch checkout to determine if discount exist but should') })
    })
}

function discount_isEligible(client, checkoutId, productId) {
    return new Promise((resolve, reject) => {
        discount_isExist(client, checkoutId).then(
            () => { console.log('discount already applied. no need to re-apply.'); reject(false); },
            () => {
                ruleQuantityForDiscount_isSatisfied(client, checkoutId, productId).then(
                    () => { console.log('eligible for discount'); resolve(true) },
                    () => { console.log('not eligible for discount since #items is less than 2'); resolve(false); }
                )
            }
        )
    })
}

function discount_apply(client, checkoutId, discountCode) {
    return new Promise((resolve, reject) => {
        client.checkout.addDiscount(btoa(checkoutId), discountCode).then(
            () => { console.log('applied discount'); resolve(true); },
            () => { console.log('unable to apply discount but should'); reject(); }
        )
    })
}

function discount_clear(client, checkoutId, discountCode) {
    return new Promise((resolve, reject) => {
        client.checkout.fetch(checkoutId).then(
            (checkout) => {
                checkout.discountApplications.foreach((discountApplication) => {
                    if (discountApplication == discountCode) {
                        client.checkout.removeDiscount(checkoutId).then(
                            () => { console.log('removed discount'); resolve(true); },
                            () => { console.log('unable to remove discount'); reject(); })
                    }
                })
            },
            () => { console.log('unable to fetch checkout but should'); }
        );
    })
}

function ruleQuantityForDiscount_isSatisfied(client, checkoutId, productId) {
    return new Promise((resolve, reject) => {
        client.checkout.fetch(checkoutId).then(
            (checkout) => {
                let quantityInCart = 0;
                checkout.lineItems.forEach((lineItem) => {
                    if (lineItem.variant.product.id == productId) {
                        quantityInCart += lineItem.quantity
                    }
                });
                console.log('found (' + quantityInCart + ') items in checkout');
                if (quantityInCart > 1) {
                    resolve(true);
                }
                else { reject(); }
            },
            () => { console.log('unable to count line items but should'); reject(); }
        )
    })
}

function updateView(client, checkoutId, productId) {
    let $productId = document.getElementById('productId');
    let $productName = document.getElementById('productName');
    let $productPrice = document.getElementById('productPrice');
    let $productImage = document.getElementById('productImage');

    let $productNameUpsell = document.getElementById('productNameUpsell');
    let $productImageUpsell = document.getElementById('productImageUpsell');
    let $productPriceBeforeDiscount = document.getElementById('productPriceBeforeDiscount');
    let $productPriceAfterDiscount = document.getElementById('productPriceAfterDiscount');

    client.product.fetch(btoa(productId)).then((product) => {
        $productId.textContent = product.id;
        $productNameUpsell.textContent = product.title;
        $productImageUpsell.src = product.images[0].src;
        $productImageUpsell.style.height = '50px';
        $productImageUpsell.style.width = '50px';
        $productPriceBeforeDiscount.textContent = '$ ' + Number(product.variants[0].priceV2.amount).toFixed(2) + ' ' + product.variants[0].priceV2.currencyCode;

        client.checkout.fetch(checkoutId).then((checkout) => {
            checkout.lineItems.forEach((lineItem) => {
                $productName.textContent = lineItem.title;
                $productPrice.textContent = '$ ' + Number(lineItem.variant.priceV2.amount).toFixed(2) + ' ' + lineItem.variant.priceV2.currencyCode;
                $productImage.src = lineItem.variant.image.src;
                $productImage.style.height = '50px';
                $productImage.style.width = '50px';

                lineItem.discountAllocations.forEach((discountAllocation) => {
                    $productPriceAfterDiscount.textContent = '$ ' + Number(Number(lineItem.variant.priceV2.amount) - (Number(lineItem.variant.priceV2.amount) * (Number(discountAllocation.discountApplication.value.percentage) / 100))).toFixed(2) + ' ' + discountAllocation.allocatedAmount.currencyCode;
                })
            })
        });
    })
}