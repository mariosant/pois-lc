export const points = `
query {
  points {
    _id
    title
    address
  }
}
`;

export const deletePoint = `
mutation deletePoint($_id: ID!) {
  deletePoint(_id: $_id) {
    _id
  }
}
`;

export const createPoint = `
mutation createPoint($title: String!, $address: String!) {
    createPoint(title: $title, address: $address) {
        _id
        title
        address
        createdAt
    }
}
`;