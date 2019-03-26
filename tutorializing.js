class Tutorializer {
    constructor(docFile) {
        this.docFile = docFile;
        this.doc = null;
    }

    init() {
        if(window.fetch) {
            fetch(this.docFile)
                .then(this._status)
                .then(res => res.text())
                .then(this.assignDoc)
                .catch(this.error);
        }
    }

    error(...msg) {
        console.log(...msg);
    }

    _status(res) {
        if(res.ok) return res;
        return Promise.reject("Não foi possível importar a documentação");
    }

    assignDoc(textXml) {
        let parser = new DOMParser();
        let doc = parser.parseFromString(textXml, "application/xml");
        if(doc.firstChild.nodeName == "parsererror") {
            this.error("Não foi possível converter a documentação", textXml);
            return;
        }
        let docTag = doc.getElementsByTagName('doc')[0];
        for(let i = 0; i < docTag.children.length; i++) {
            let nodes = document.querySelectorAll("[data-doc="+docTag.children[i].nodeName+"]");
            let text = docTag.children[i].innerHTML;
            nodes.forEach(node => 
                new Tooltip(node, {
                    title: text
                })
            );
        }
    }
}