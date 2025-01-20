export const formatAmount = (amount) => {
    return amount.toLocaleString('en-US', {
        style: 'currency',
        currency: 'PHP',
    })
}