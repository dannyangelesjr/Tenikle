function addingVariantToCart(client, checkoutId, product, discountCode) {
    return new Promise((resolve, reject) => {
        console.log('*** addVariantToCart START');
        discount_isExist(cart).then(
            (isDiscountExist) => discount_isEligible(cart, productId, discountCode, quantity)).then(
                (isDiscountEligible) => {
                    if (isDiscountEligible && isDiscountExist) {
                        resolve();
                    }
                })
        // updateView(client, checkoutId, product.storefrontId).then(
        //     () => { showModal(true); console.log('*** addVariantToCart END'); resolve(); },
        //     () => { console.log('unable to refresh view but should'); reject() }
        // )        
    })
}


function updatingVariant(client, checkoutId, product, discountCode) {
    return new Promise((resolve, reject) => {
        console.log('*** updateVariant START');
        discount_eligibilityApplication(client, product.cart, checkoutId, product.storefrontId, discountCode, product.selectedQuantity).then(
            () => {
                updateView(client, checkoutId, product.storefrontId).then(
                    () => { showModal(true); console.log('*** updateVariant END'); resolve(); },
                    () => { console.log('unable to refresh view but should'); reject() }
                )
            },
            () => { console.log('unable to determine eligibility'); reject(); }
        )
    })
}

function openingCheckout(client, cart, checkoutId, discountCode) {
    console.log('*** openCheckout START')
    return new Promise((resolve, reject) => {
        cart.lineItems.forEach((lineItem) => {
            discount_eligibilityApplication(client, cart, checkoutId, lineItem.variant.product.id, discountCode, 0)
        });
        console.log('*** openCheckout END');
        resolve();
    })
}

function updatingItemQuantity(client, cart, checkoutId, discountCode) {
    console.log('*** updateItemQuantity START')
    return new Promise((resolve, reject) => {
        cart.lineItems.forEach((lineItem) => {
            discount_eligibilityApplication(client, cart, checkoutId, lineItem.variant.product.id, discountCode, 0);
        });
        console.log('*** updateItemQuantity END')
        resolve();
    })
}

function discount_eligibilityApplication(client, cart, checkoutId, productId, discountCode, quantity) {
    discount_isExist(cart).then(
        (isDiscountExist) => {
            if (isDiscountExist) {
                discount_isEligible(cart, productId, discountCode, quantity).then(
                    (isEligible) => {
                        if (isEligible) {
                            console.log('eligible for discount and discount in cart. Nothing to do');
                            resolve(true);
                        }
                        else {
                            console.log('not eligible for discount and discount in cart. Removing');
                            discount_clear(client, checkoutId, discountCode).then(
                                () => { console.log('discount cleared succesfully'); resolve(); },
                                () => { console.log('discount not cleared unsuccessfully'); reject(); })
                        }
                    },
                    () => { console.log('unable to check eligibility but should'); reject(); }
                )
            }
            else {
                discount_isEligible(cart, productId, discountCode, quantity).then(
                    (isEligible) => {
                        if (isEligible) {
                            console.log('eligible for discount and discount not in cart. Adding');
                            discount_apply(client, checkoutId, discountCode).then(
                                () => { console.log('discount cleared succesfully'); resolve(); },
                                () => { console.log('discount not cleared unsuccessfully'); reject(); })
                        }
                        else {
                            console.log('not eligible for discount and discount not in cart. Nothing to do');
                            resolve(false);
                        }
                    },
                    () => { console.log('unable to check eligibility but should'); reject(); }
                )
            }
        },
        () => { console.log('unable to check eligibility but should'); reject(); }
    )
}

function showModal(isVisible) {
    let upsellModal = document.getElementById("upsellModal");
    upsellModal.hidden = !isVisible;
    console.log('modal frame visible = ' + isVisible);
    if (isVisible) {
        console.log('showing modal frame for buyButton');
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
}

function cart_get() {
    return new Promise((resolve, reject) => {
        let isCartExist = false;
        for (var checkoutId, key, i = 0; i < localStorage.length; ++i) {
            key = localStorage.key(i);
            if (key.match(shopifyDomain + '.checkoutId')) {
                checkoutId = localStorage.getItem(key);
                isCartExist = true;
                break;
            }
        }
        if (isCartExist) {
            console.log('found cart!');
            resolve(checkoutId);
        }
        else {
            console.log('no cart found'); reject();
        }
    })
}

function discount_isExist(cart) {
    let discountExist = false;
    if (cart.lineItems.length > 0) {
        new Promise((resolve, reject) => {
            cart.lineItems.forEach((lineItem) => {
                new Promise((resolve, reject) => {
                    lineItem.discountAllocations.forEach((discountAllocation) => {
                        if (discountAllocation.discountApplication.code == _discountCode) {
                            discountExist = true;
                            resolve(true);
                        }
                    });
                });
            })
            resolve(false);
        })
    }
    if (discountExist) {
        console.log('discount in cart');
        resolve(true);
    } else {
        console.log('discount not in cart');
        resolve(false);
    }
}

function discount_isEligible(cart, productId, discountCode, quantityToAddToCart) {
    return new Promise((resolve, reject) => {
        ruleQuantityForDiscount_isSatisfied(cart, productId, quantityToAddToCart).then(
            (isRuleSatisfied) => {
                if (isRuleSatisfied) {
                    console.log('eligible for discount');
                    resolve(true);
                }
                else {
                    console.log('does not meet discount requirement. Not eligible for discount');
                    resolve(false);
                }
            },
            () => {
                console.log('unable to check rule but should');
                resolve(false);
            }
        )
        resolve(false);
    })
}

function discount_apply(client, checkoutId, discountCode) {
    return new Promise((resolve, reject) => {
        console.log('trying to add discount ' + checkoutId + ' ' + discountCode);
        client.checkout.addDiscount(btoa(checkoutId), discountCode).then(
            () => {
                resolve();
                console.log('added discount');
            },
            () => {
                reject();
                console.log('unable to add discount but should')
            }
        )
        console.log('exiting discount_apply')
    })
}

function discount_clear(client, checkoutId, discountCode) {
    return new Promise((resolve, reject) => {
        console.log('trying to remove discount');
        client.checkout.fetch(checkoutId).then(
            (checkout) => {
                new Promise((resolve, reject) => {
                    checkout.discountApplications.forEach((discountApplication) => {
                        if (discountApplication.code == discountCode) {
                            client.checkout.removeDiscount(checkoutId).then(
                                () => { isDiscountRemoved = true; console.log('removed discount'); resolve(true); },
                                () => { reject(); console.log('unable to remove discount but should'); })
                        }
                    })
                    resolve();
                })
            },
            () => { reject(); console.log('unable to remove discount but should'); }
        ).catch(ex => console.log('!!! exception ' + ex))
    })
}

function ruleQuantityForDiscount_isSatisfied(cart, productId, quantityToAddToCart) {
    return new Promise((resolve, reject) => {
        let quantityInCart = quantityToAddToCart;
        if (cart.lineItems.length > 0) {
            new Promise((resolve, reject) => {
                cart.lineItems.forEach((lineItem) => {
                    if (lineItem.variant.product.id == productId) {
                        quantityInCart += lineItem.quantity
                    }
                })
                console.log('found (' + quantityInCart + ') items in checkout')
                resolve(quantityInCart > 1);
            })
        }
        resolve(quantityInCart > 1);
    })
}


function updateView(client, checkoutId, productId) {
    return new Promise((resolve, reject) => {
        let $productId = document.getElementById('productId');
        let $productName = document.getElementById('productName');
        let $productPrice = document.getElementById('productPrice');
        let $productImage = document.getElementById('productImage');

        let $productNameUpsell = document.getElementById('productNameUpsell');
        let $productImageUpsell = document.getElementById('productImageUpsell');
        let $productPriceBeforeDiscount = document.getElementById('productPriceBeforeDiscount');
        let $productPriceAfterDiscount = document.getElementById('productPriceAfterDiscount');

        client.product.fetch(btoa(productId)).then(
            (product) => {
                $productId.textContent = product.id;
                $productNameUpsell.textContent = product.title;
                $productImageUpsell.src = product.images[0].src;
                $productImageUpsell.style.height = '50px';
                $productImageUpsell.style.width = '50px';
                $productPriceBeforeDiscount.textContent = '$ ' + Number(product.variants[0].priceV2.amount).toFixed(2) + ' ' + product.variants[0].priceV2.currencyCode;

                console.log('1. fetching checkoutId to display productName etc')
                client.checkout.fetch(checkoutId).then(
                    (checkout) => {
                        console.log('2. about to retrieve productName etc.')
                        new Promise((resolve, reject) => {
                            checkout.lineItems.forEach((lineItem) => {
                                console.log('3. looping to retrieve productName etc.')
                                $productName.textContent = lineItem.title;
                                $productPrice.textContent = '$ ' + Number(lineItem.variant.priceV2.amount).toFixed(2) + ' ' + lineItem.variant.priceV2.currencyCode;
                                $productImage.src = lineItem.variant.image.src;
                                $productImage.style.height = '50px';
                                $productImage.style.width = '50px';

                                console.log('4. about foreach discountallocation to retrieve productName etc')
                                new Promise((resolve, reject) => {
                                    lineItem.discountAllocations.forEach((discountAllocation) => {
                                        console.log('5. looping discountallocation to retrieve productName etc')
                                        $productPriceAfterDiscount.textContent = '$ ' + Number(Number(lineItem.variant.priceV2.amount) - (Number(lineItem.variant.priceV2.amount) * (Number(discountAllocation.discountApplication.value.percentage) / 100))).toFixed(2) + ' ' + discountAllocation.allocatedAmount.currencyCode;
                                    })
                                    resolve();
                                })
                                console.log('6. out of the loop to retrieve productName etc');
                            });
                            resolve();
                        })
                        console.log('7. resolved to retrieve productName etc');
                        resolve();
                    },
                    () => { console.log('unable to fetch checkout but should'); reject(); }
                )
            },
            () => { console.log('unable to refresh view but should'); reject(); }
        )
    })
}