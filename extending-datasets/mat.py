class MAT():

    def __init__(self):
        self.keywords = ['todo', 'hack', 'fixme', 'xxx']

    def has_task_words(self, x):
        words = x.lower().replace("'", "").replace(':',' ').split(' ')
        for word in words:
            for key in self.keywords:
                if word.startswith(key) or word.endswith(key):
                    if 'xxx' in word and word != 'xxx':
                        return 0   
                    else:
                        return 1
        return 0

    def predict(self, x_target):
        return [ self.has_task_words(x) for x in x_target ]