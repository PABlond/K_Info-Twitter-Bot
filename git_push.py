from git import Repo


def push(repo_path):
    repo = Repo(repo_path)
    print(repo)
    print("To Update", [item.a_path for item in repo.index.diff(None)])
    for filename in repo.untracked_files:
        print("commit {}".format(filename))
        repo.git.add(filename)
        repo.git.commit('-m', 'update {}'.format(filename),
                        author='pablond <pierre-alexis.blond@live.fr>')
    for filename in repo.index.diff(None):
        print("commit {}".format(filename.a_path))
        repo.git.add(filename.a_path)
        repo.git.commit('-m', 'update {}'.format(filename),
                        author='pablond <pierre-alexis.blond@live.fr>')


if __name__ == '__main__':
    push(repo_path="")
