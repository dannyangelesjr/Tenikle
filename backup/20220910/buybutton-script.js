function addingVariantToCart(client, checkoutId, product, discountCode) {
    return new Promise((resolve, reject) => {
        console.log('*** addingVariantToCart START');

        updateCart(client, product.cart, product.storefrontId, product.selectedVariant.id, discountCode, product.selectedQuantity);
        // discount_eligibilityApplication(client, product.cart, checkoutId, product.storefrontId, discountCode, product.selectedQuantity).then(() => {
        //     updateView(client, checkoutId, product.storefrontId).then(() => {
        //         showModal()
        //         resolve();
        //         console.log('*** addingVariantToCart END');
        //     })
        // })
    })
}

function updatingVariant(client, checkoutId, product, discountCode) {
    return new Promise((resolve, reject) => {
        console.log('*** updateVariant START');
        discount_eligibilityApplication(client, product.cart, checkoutId, product.storefrontId, discountCode, product.selectedQuantity).then(
            () => {
                updateView(client, checkoutId, product.storefrontId).then(
                    () => { showModal(); resolve(); console.log('*** updateVariant END'); },
                    (ex) => { reject(ex) }),
                    (ex) => { reject(ex) }
            })
    })
}

function openingCheckout(client, cart, checkoutId, discountCode) {
    return new Promise((resolve, reject) => {
        console.log('*** openCheckout START')
        let x = 1;
        for (const lineItem of cart.lineItems) {
            discount_eligibilityApplication(client, cart, checkoutId, lineItem.variant.product.id, discountCode, 0).then(() => {
                if (x = cart.lineItems.length) {
                    console.log('checking discount eligibility for lineItem');
                    resolve();
                    console.log('*** openCheckout END');
                }
            })
        }
    })
}

function updatingItemQuantity(client, cart, checkoutId, discountCode) {
    return new Promise((resolve, reject) => {
        console.log('*** updateItemQuantity START');
        for (const lineItem of cart.lineItems) {
            console.log('checking discount eligibility for lineItem');

            discount_eligibilityApplication(client, cart, checkoutId, lineItem.variant.product.id, discountCode, 0).then(
                () => { if (x = cart.lineItems.length) { console.log('*** updateItemQuantity END'); resolve(); } },
                (ex) => { reject(ex); })
        }
    })
}

function discount_eligibilityApplication(client, cart, checkoutId, productId, discountCode, quantity) {
    return new Promise((resolve, reject) => {
        let isDiscountExist = discount_isExist(cart, discountCode);
        let isDiscountEligible = discount_isEligible(cart, productId, discountCode, quantity)

        if (isDiscountExist) {
            if (isDiscountEligible) {
                console.log('eligible for discount and discount in cart. Nothing to do');
                resolve(true);
            }
            else {
                console.log('not eligible for discount and discount in cart. Removing');
                discount_clear(client, checkoutId, discountCode).then(
                    () => { console.log('discount cleared succesfully'); resolve(true); },
                    (ex) => { reject(ex) })
            }
        }
        else {
            if (isDiscountEligible) {
                console.log('eligible for discount and discount not in cart. Adding');
                discount_apply(client, checkoutId, discountCode).then(
                    (checkout) => { console.log('discount added succesfully?'); resolve(true); },
                    (ex) => { reject(ex) })
            }
            else {
                console.log('not eligible for discount and discount not in cart. Nothing to do');
                resolve(true);
            }
        }
    })
}

function showModal() {
    let upsellModal = document.getElementById("upsellModal");
    console.log('show / hide modal frame depending on upsellModal.hidden value ' + upsellModal.hidden);

    let isVisible = !upsellModal.hidden
    upsellModal.hidden = isVisible;

    let iframe = document.getElementsByName('frame-product-4958989615190');
    if (!isVisible) {
        for (let i = 0; i < iframe.length; i++) {
            if (!isVisible) {
                iframe[i].style.height = '108px';
            }
            else {
                iframe[i].style.height = '0px';
            }
        }
    }
}

function cart_get(client) {
    return new Promise((resolve, reject) => {
        console.log('retrieving checkoutId')
        //let checkoutId = localStorage.getItem('checkoutId');

        for (var checkoutId, key, i = 0; i < localStorage.length; ++i) {
            key = localStorage.key(i);
            if (key.match(shopifyDomain + '.checkoutId')) {
                console.log('found it!')
                checkoutId = localStorage.getItem(key);                
            }
        }        

        if (checkoutId != null) {
            console.log('awesome! found cart');
            resolve(checkoutId);
        }
        else {
            console.log('cart not found. creating  one!');
            client.checkout.create().then((checkout) => {
                localStorage.setItem('checkoutId', checkout.id);
                console.log('cart created');
                resolve(checkout.id);
            });
        }
    })
}

function discount_isExist(cart, discountCode) {
    let isDiscountExist = false;
    if (cart.lineItems.length > 0) {
        for (const lineItem of cart.lineItems) {
            for (const discountAllocation of lineItem.discountAllocations) {
                if (discountAllocation.discountApplication.code == discountCode) {
                    isDiscountExist = true;
                }
            };
        }
    }
    if (isDiscountExist) {
        console.log('discount in cart');
    } else {
        console.log('discount not in cart');
    }
    return isDiscountExist;
}

function discount_isEligible(cart, productId, discountCode, quantityToAddToCart) {
    return new Promise((resolve, revert) => {
        let isRuleSatisfied = ruleQuantityForDiscount_isSatisfied(cart, productId, quantityToAddToCart)
        if (isRuleSatisfied) {
            console.log('eligible for discount');
            resolve(true);
        }
        else {
            console.log('does not meet discount requirement. Not eligible for discount');
            resolve(false);
        }
    })
}

function discount_apply(client, checkoutId, discountCode) {
    return new Promise((resolve, reject) => {
        console.log('trying to add discount ' + discountCode);
        client.checkout.addDiscount(btoa(checkoutId), discountCode).then(
            (checkout) => { console.log('discount hopefully added ' + discountCode); resolve(); },
            (ex) => { reject(ex); })
    })
}

function discount_clear(client, checkoutId, discountCode) {
    return new Promise(async (resolve, reject) => {
        console.log('trying to remove discount ' + discountCode);
        client.checkout.removeDiscount(btoa(checkoutId)).then(
            (checkout) => { console.log('discount hopefully removed ' + discountCode); resolve(); },
            (ex) => { reject(ex); })
    })
}

function ruleQuantityForDiscount_isSatisfied(cart, productId, quantityToAddToCart) {
    let quantityInCart = quantityToAddToCart;
    if (cart.lineItems.length > 0) {
        for (const lineItem of cart.lineItems) {
            if (lineItem.variant.product.id == productId) {
                quantityInCart += lineItem.quantity
            }
        }
        console.log('found (' + quantityInCart + ') items in checkout')
    }
    return (quantityInCart > 1);
}

function updateView(client, checkoutId, productId) {
    return new Promise((resolve, reject) => {
        console.log('updating view')
        let $productId = document.getElementById('productId');
        let $productName = document.getElementById('productName');
        let $productPrice = document.getElementById('productPrice');
        let $productImage = document.getElementById('productImage');

        let $productNameUpsell = document.getElementById('productNameUpsell');
        let $productImageUpsell = document.getElementById('productImageUpsell');
        let $productPriceBeforeDiscount = document.getElementById('productPriceBeforeDiscount');
        let $productPriceAfterDiscount = document.getElementById('productPriceAfterDiscount');

        console.log('1. fetching by productId to display productName etc')
        client.product.fetch(btoa(productId)).then(
            async (product) => {
                $productId.textContent = product.id;
                $productNameUpsell.textContent = product.title;
                $productImageUpsell.src = product.images[0].src;
                $productImageUpsell.style.height = '50px';
                $productImageUpsell.style.width = '50px';
                $productPriceBeforeDiscount.textContent = '$ ' + Number(product.variants[0].priceV2.amount).toFixed(2) + ' ' + product.variants[0].priceV2.currencyCode;

                console.log('2. fetching by checkoutId to display productName etc');
                client.checkout.fetch(checkoutId).then(
                    (checkout) => {
                        console.log('3. looping by lineitem')
                        for (const lineItem of checkout.lineItems) {
                            console.log('4. looping to retrieve productName etc.')
                            $productName.textContent = lineItem.title;
                            $productPrice.textContent = '$ ' + Number(lineItem.variant.priceV2.amount).toFixed(2) + ' ' + lineItem.variant.priceV2.currencyCode;
                            $productImage.src = lineItem.variant.image.src;
                            $productImage.style.height = '50px';
                            $productImage.style.width = '50px';

                            console.log('5. looping by discount allocation')
                            for (const discountAllocation of lineItem.discountAllocations) {
                                $productPriceAfterDiscount.textContent = '$ ' + Number(Number(lineItem.variant.priceV2.amount) - (Number(lineItem.variant.priceV2.amount) * (Number(discountAllocation.discountApplication.value.percentage) / 100))).toFixed(2) + ' ' + discountAllocation.allocatedAmount.currencyCode;
                            }
                            console.log('6. exit looping by discount allocation')
                        }
                        console.log('7. exit looping by lineitem')
                        resolve();
                        console.log('8. update view resolve')
                    }
                ).catch(ex => console.log('exception thrown ' + ex))
            })
    })
}

function lineItem_add(client, checkoutId, variantId, quantity) {
    return new Promise((resolve, reject) => {
        let lineItemToAdd = [
            {
                variantId: btoa(variantId),
                quantity: quantity
            }];
        client.checkout.addLineItems(btoa(checkoutId), lineItemToAdd).then(
            (checkout) => { console.log('lineitem added'); resolve(checkout); },
            () => { console.log('lineitem not added but should'); reject(); }
        )
    })
}

function lineItem_update(client, checkoutId, lineItemId, quantity) {
    return new Promise((resolve, reject) => {
        let lineItemToUpdate = [
            {
                id: btoa(lineItemId),
                quantity: quantity
            }
        ];
        client.checkout.updateLineItems(btoa(checkoutId), lineItemToUpdate).then(
            () => { console.log('lineitem updated'); resolve(); },
            () => { console.log('lineitem not update but should'); reject(); }
        )
    })
}

function item_isInCart(client, checkoutId, variantId) {
    return new Promise((resolve, reject) => {
        client.checkout.fetch(checkoutId).then(
            (checkout) => {
                let isItemInCart = false;
                if (checkout.lineItems.length > 0) {
                    checkout.lineItems.forEach((lineItem) => {
                        if (variantId == lineItem.variant.id) {
                            isItemInCart = true;
                            console.log('found item in cart'); resolve(lineItem);
                        }
                    })
                }
                if (!isItemInCart) { reject(); }
            },
            () => {
                console.log('item not found in cart'); reject();
            }
        )
    })
}

function updateCart(client, cart, productId, variantId, discountCode, quantity) {
    cart_get(client).then(
        (checkoutId) => {
            item_isInCart(client, checkoutId, variantId)
                .then(
                    (lineItem) => { lineItem_update(client, checkoutId, lineItem.id, quantity + lineItem.quantity); },
                    () => {
                        lineItem_add(client, checkoutId, variantId, quantity).then(
                            () => { console.log('done') },
                            () => { console.log('ney') });
                    }
                ).then(
                    () => {
                        discount_isEligible(cart, productId, discountCode, quantity).then(
                            (eligible) => {
                                if (eligible) { discount_apply(client, checkoutId, discountCode).then(console.log('discount applied')) }
                                else { discount_clear(client, checkoutId, discountCode).then(console.log('discount removed')) }
                            },
                            () => { console.log('discount not applied') }
                        );
                    });
        },
        () => {
            cart_create(client).then(
                (checkoutId) => { lineItem_add(client, checkoutId, variantId, quantity); resolve(); })
        })
}