const querySort = function (sort, args, sortable = []) {
    const [column, order] = `${sort}`.split(':');
    let sorted = args;
    if (sortable.includes(column)) {
        sorted = args.sort((a, b) => {
            const aColValue = (isNaN(a[column])) ? a[column].toUpperCase() : parseInt(a[column]);
            const bColValue = (isNaN(b[column])) ? b[column].toUpperCase() : parseInt(b[column]);

            if (order.toLowerCase() === 'asc') {
                if (aColValue < bColValue) return -1;
                else if (aColValue > bColValue) return 1;
            } else if (order.toLowerCase() === 'desc') {
                if (bColValue < aColValue) return -1;
                else if (bColValue > aColValue) return 1;
            }
            return 0;
        })
    }
    return sorted;
};


module.exports = {
    querySort
};