const PizZip = require('pizzip');
const DocxTemplater = require('docxtemplater');
const path = require('path');
const fs = require('fs');


const filePath = path.resolve(__dirname, '../../static');



const generateWordFile = async (params) => {
    const content = fs.readFileSync(path.resolve(filePath, 'source.docx'), 'binary');
    const zip = new PizZip(content);
    const docx = new DocxTemplater(zip);
    docx.setData(params);
    try {
        docx.render();
    } catch (error) {
    }
    const buf = docx.getZip().generate({type: 'nodebuffer'});

    fs.writeFileSync(path.resolve(filePath, 'out.docx'), buf);
}



module.exports = {
    generateWordFile
}