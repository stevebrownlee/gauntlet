operator >>= left 1 = (left, right) => {
    return #`${left}.then(res => res.json()).then(${right})`;
};

fetch('../data/classes.json') >>= data => console.log(data)