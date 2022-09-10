function addingVariantToCart(client, product, discountCode) {
    return new Promise((resolve, reject) => {
        console.log('addingVariantToCart start');
        //need to get checkoutid
        discount_application(client, product.storefrontId, product.selectedVariant.id, product.selectedQuantity, discountCode).then(
            () => { console.log('addingVariantToCart end'); resolve() },
            (ex) => { console.log('addVaroamtToCart end with exception'); reject(ex) })
    })
}

function updatingItemQuantity(client, cart, discountCode) {
    return new Promise((resolve, reject) => {
        console.log('addingVariantToCart start');
        for (const lineItem of cart.lineItems) {
            console.log(lineItem.variableValues('id'));
            discount_application(client, lineItem.variant.product.id, lineItem.variant.id, lineItem.quantity, discountCode).then(
                () => { console.log('addingVariantToCart end'); resolve() },
                (ex) => { console.log('addVaroamtToCart end with exception'); reject(ex) })
        }
    })
}

function checkoutId_get(client) {
    return new Promise((resolve, reject) => {
        console.log('retrieving checkoutId')
        let checkoutId = sessionStorage.getItem('checkoutId');
        if (checkoutId != null) { console.log('awesome! found cart'); resolve(checkoutId); }
        else {
            console.log('cart not found. creating  one!');
            client.checkout.create().then(
                (checkout) => { sessionStorage.setItem('checkoutId', checkout.id); console.log('cart created'); resolve(checkout.id); },
                (ex) => { reject(ex); }
            )
        }
    })
}

function discount_eligibilityCheck(discountCode) {
    console.log('checking discount applicability');
    return new Promise((resolve, reject) => {
        discount_ruleSatisfied().then(
            (isSatisfied) => {
                if (isSatisfied) { console.log('discount requirement met'); resolve(true) }
                else { console.log('discount requirement not met'); resolve(false); }
            },
            (ex) => { reject(ex); }
        )
    })
}

function discount_appliedToCartCheck(client, checkoutId, discountCode) {
    console.log('checking if discount availed');
    return new Promise((resolve, reject) => {
        console.log('trying to add discount ' + discountCode);
        client.checkout.addDiscount(btoa(checkoutId), discountCode).then(
            (checkout) => { console.log('discount hopefully added ' + discountCode); resolve(); },
            (ex) => { reject(ex); })
    })
}

function discount_ruleSatisfied() {
    console.log('verifying if quantity meets the min 2 quantity')
    return new Promise((resolve, reject) => {
        console.log('x items found in cart. Meets requirement')
        resolve(true);
        // console.log('x items found in cart. Falls short of requirement')
        // resolve(false);
    })
}

function discount_apply(discountCode) {
    console.log('trying to apply discount')
    return new Promise((resolve, reject) => {
        console.log('discount applied')
        resolve(true);
        // console.log('unable to apply discount')
        // reject('exception message');
    })
}

function discount_remove(discountCode) {
    console.log('trying to remove discount')
    return new Promise((resolve, reject) => {
        console.log('discount removed')
        resolve(true);
        // console.log('unable to remove discount');
        // reject('exception message')
    })
}

function discount_application(client, product, discountCode) {
    return new Promise((resolve, reject) => {
        checkoutId_get(client).then(
            (checkoutId) => {
                console.log('checkoutId retrieved');
                discount_eligibilityCheck(client, checkoutId, product.selectedProductId, product.selectedQuantity, discountCode).then(
                    (isDiscountApplicable) => {
                        if (isDiscountApplicable) {
                            discount_appliedToCartCheck(discountCode).then(
                                (isDiscountApplied) => {
                                    if (isDiscountApplied) { console.log('discount applicable and already availed. Nothing to do.') }
                                    else { console.log('discount is applicable but not yet applied'); discount_apply(discountCode).then(() => { console.log('success but was it really applied?'); console.log('addingVariantToCart end'); resolve(true) }, (ex) => { reject(ex); }) }
                                },
                                (ex) => { reject(ex) }
                            )
                        }
                        else {
                            discount_appliedToCartCheck(discountCode).then(
                                (isDiscountApplied) => {
                                    if (isDiscountApplied) {
                                        console.log('discount is no longer applicable. Must remove.'); discount_remove(discountCode).then(
                                            (isApplied) => {
                                                if (isApplied) { console.log('success but was it really removed?'); console.log('addingVariantToCart end'); resolve() }
                                                else { console.log('unable to remove discount but should') }
                                            },
                                            (ex) => { reject(ex); })
                                    }
                                    else { console.log('discount is not applicable and not applied. Nothing to do.') }
                                },
                                (ex) => { reject(ex); }
                            )
                        }
                    }
                )
            },
            (ex) => { reject(ex); }
        )
    })
}