import requests
from bs4 import BeautifulSoup
import argparse
import re


def fetch_passage(book, start_ch, start_v, end_ch, end_v, version="NABRE"):
    search = f"{book} {start_ch}:{start_v}-{end_ch}:{end_v}"
    url = "https://www.biblegateway.com/passage/"
    params = {"search": search, "version": version}
    headers = {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }

    try:
        response = requests.get(url, params=params, headers=headers, timeout=10)
        response.raise_for_status()
    except requests.RequestException as e:
        raise ValueError(f"Failed to fetch page: {e}")

    soup = BeautifulSoup(response.text, "html.parser")

    # Try multiple possible containers for the passage
    passage = None
    for selector in [
        ("div", {"class": "passage-content"}),
        ("div", {"class": "result-text-style-normal"}),
        ("div", {"id": "passage-text"}),
        ("div", {"class": "passage-display"}),
    ]:
        tag, attrs = selector
        passage = soup.find(tag, attrs=attrs)
        if passage:
            break

    if not passage:
        div_classes = [
            div.get("class") for div in soup.find_all("div") if div.get("class")
        ]
        print("Debug: No passage text found. Available div classes:", div_classes[:10])
        print("First 1000 characters of response:", response.text[:1000])
        raise ValueError(
            "Could not find passage text on Bible Gateway. The website structure may have changed."
        )

    # Remove unwanted elements
    for elem in passage.find_all(
        ["a", "sup", "span"], class_=["footnote", "crossref", "versenum", "chapnum"]
    ):
        elem.decompose()

    # Remove "Read full chapter" link and footnote/cross-reference sections
    for elem in passage.find_all(
        ["div", "p", "a"],
        text=re.compile(r"Read full chapter|Footnotes|Cross references"),
    ):
        elem.decompose()

    # Extract raw text
    raw_text = []
    for child in passage.children:
        if hasattr(child, "get_text"):
            text = child.get_text(separator=" ", strip=True)
            # Skip any remaining footnote/cross-reference markers (e.g., [ a ], ( A ))
            text = re.sub(r"\[\s*[a-z]\s*\]|\(\s*[A-Z]\s*\)", "", text)
            if text and not re.match(
                r"^(Footnotes|Cross references|Read full chapter)", text
            ):
                raw_text.append(text)

    passage_text = " ".join(raw_text).strip()
    if not passage_text:
        raise ValueError("No text extracted from the passage.")

    return passage_text


def write_markdown(book, passage_text, start_ch, start_v, end_ch, end_v):
    start_ref = f"{start_ch}:{start_v}"
    end_ref = f"{end_ch}:{end_v}"
    markdown_output = f"# {book} {start_ref}–{end_ref} (NABRE)\n\n{passage_text}\n"
    print(markdown_output)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Fetch a range of Bible verses from the Catholic NABRE translation and print to stdout."
    )
    parser.add_argument("book", type=str, help='Bible book (e.g., "Luke")')
    parser.add_argument("start_ch", type=int, help="Starting chapter")
    parser.add_argument("start_v", type=int, help="Starting verse")
    parser.add_argument("end_ch", type=int, help="Ending chapter")
    parser.add_argument("end_v", type=int, help="Ending verse")

    args = parser.parse_args()

    try:
        passage_text = fetch_passage(
            args.book, args.start_ch, args.start_v, args.end_ch, args.end_v
        )
        write_markdown(
            args.book,
            passage_text,
            args.start_ch,
            args.start_v,
            args.end_ch,
            args.end_v,
        )
    except Exception as e:
        print(f"Error: {e}")
        print(
            "Please ensure you have 'requests' and 'beautifulsoup4' installed: pip install requests beautifulsoup4"
        )
        print(
            "Also verify the book name and verse range are valid (e.g., 'Luke 24 50 24 53')."
        )
