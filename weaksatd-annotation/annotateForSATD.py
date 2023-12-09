from tqdm import tqdm
from argparse import ArgumentParser
from utils import load_data, has_task_words, extract_comment, save_data

FILENAMES = ["complete"]

# --input-path ./cfl --output-path ../data --output-path-labelled ../data-labelled/cfl

def read_args():
    parser = ArgumentParser()

    parser.add_argument("--input-path", type=str, required=True)
    parser.add_argument("--output-path", type=str, required=True)

    return parser.parse_args()

def addKey(data, newKey):
    if newKey in data:
        return data

    data[newKey] = ""
    return data

COMMIT_IDS = {
    "chrome": "57f97b2",
    "firefox": "4d46db3ff28b",
    "kernel": "e2ca6ba"
}

PROJECT_NAMES = {
    "chrome": "Chromium",
    "firefox": "Mozilla Firefox",
    "kernel": "Linux Kernel"
}

if __name__ == "__main__":
    args = read_args()
    print(args)
    
    for filename in FILENAMES:
        path_input = "{}/{}.csv".format(args.input_path, filename)
        data = load_data(path_input, nrows=10)

        data = addKey(data, "Comments")
        data = addKey(data, "FunctionWithoutComments")
        data = addKey(data, "CommitID")
        data = addKey(data, "SATD")
        data = addKey(data, "Class")
        data = addKey(data, "HasComments")


        pbar = tqdm(total=len(data))
        for index in range(len(data)):
            pbar.update(1)
            code = data["FunctionWithComments"][data.index[index]]
            comments = extract_comment("c", code, array=True)
            data.loc[index, "SATD"] = 1 if len([comment for comment in comments if has_task_words(comment)]) > 0 else 0
            data.loc[index, "HasComments"] = 1 if len(comments) > 0 else 0
            data.loc[index, "Comments"] = "".join(comments) if len(comments) > 0 else ""
            data.loc[index, "CommitID"] = COMMIT_IDS[data["Project"][data.index[index]]]
            codeWithoutComments = code
            for comment in comments:
                codeWithoutComments = codeWithoutComments.replace(comment, "")
            data.loc[index, "FunctionWithoutComments"] = codeWithoutComments
            data.loc[index, "Class"] = data["SATD"][data.index[index]] + 2 * data["Vulnerable"][data.index[index]]


        save_data("{}".format(args.output_path), filename, data)
