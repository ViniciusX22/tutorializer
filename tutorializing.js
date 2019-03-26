class Tutorializer {
    constructor(docFile) {

        this.doc = null;
        this.docFile = docFile;
    }

    init() {
        if(window.fetch) {
            fetch(docFile)
                .then(this._status)
                .catch(this.error);
        }
    }

    error(msg) {
        console.log(msg);
        alert(msg);
    }

    _status(res) {
        if(res.ok) return res;
        return Promise.reject("Não foi possível importar a documentação");
    }

    assignDoc(res) {
        let parser = new DOMParser();
        this.doc = parser.parseFromString(res.text(), "application/xml");
        if(this.doc.parsererror) {
            this.error("Não foi possível converter a documentação");
            return;
        }
        for(let i = 0; i < this.doc.children.length; i++) {
            let nodes = document.querySelectorAll("[data-doc="+this.doc.children[i].nodeName+"]");
            let text = this.doc.children[i].innerHTML;
            nodes.forEach(node => new Tooltip(node, { title: text }));
        }
    }
}