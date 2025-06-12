import fitz  # PyMuPDF
import docx
from typing import Union

def extract_text_from_pdf(file_bytes: bytes) -> str:
    text = ""
    with fitz.open(stream=file_bytes, filetype="pdf") as doc:
        for page in doc:
            text += page.get_text()
    return text

def extract_text_from_docx(file_bytes: bytes) -> str:
    text = ""
    from io import BytesIO
    doc = docx.Document(BytesIO(file_bytes))
    for para in doc.paragraphs:
        text += para.text + "\n"
    return text

def extract_resume_text(file_bytes: bytes, filename: str) -> Union[str, None]:
    if filename.endswith(".pdf"):
        return extract_text_from_pdf(file_bytes)
    elif filename.endswith(".docx"):
        return extract_text_from_docx(file_bytes)
    else:
        return None
