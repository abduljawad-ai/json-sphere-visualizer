function jsonParser(json) {
    const nodes = [];
    const idMap = {};

    function traverse(obj, parentId) {
        const nodeId = obj.id || generateId();
        const node = { id: nodeId, name: obj.name || nodeId, parent: parentId };

        idMap[nodeId] = node;
        nodes.push(node);

        if (obj.children && Array.isArray(obj.children)) {
            for (const child of obj.children) {
                traverse(child, nodeId);
            }
        }
    }

    traverse(json, null);

    return nodes;
}

function generateId() {
    return 'node_' + Math.random().toString(36).substr(2, 9);
}

module.exports = jsonParser;