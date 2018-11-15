exports.Stack = class {
    constructor() {
        this.top = null;
        this.count = 0;
    }

    push(data) {
        const node = new Node(data);

        node.next = this.top;
        this.top = node;

        return ++this.count;
    }

    pop() {
        if (!this.top) return;

        const data = this.top.data;
        this.top = this.top.next;
        this.count--;

        return data;
    }

    peek() {
        return this.top.data;
    }
}

class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}