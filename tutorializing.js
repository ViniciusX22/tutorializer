class Tutorializer {
    constructor(docFile) {
        this.docFile = docFile;
    }

    init() {
        if(window.fetch) {
            fetch(this.docFile)
                .then(this._status)
                .then(this.assignDoc)
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
        let doc = parser.parseFromString(res.text(), "application/xml");
        if(doc.firstChild.nodeName == "parsererror") {
            this.error("Não foi possível converter a documentação");
            return;
        }
        for(let i = 0; i < doc.children.length; i++) {
            let nodes = document.querySelectorAll("[data-doc="+doc.children[i].nodeName+"]");
            let text = doc.children[i].innerHTML;
            nodes.forEach(node => new Tooltip(node, { title: text }));
        }
    }
}