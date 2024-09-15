from transformers import AutoModelForCausalLM, AutoTokenizer

class LLM_Model:
    def __init__(self, model_path = "models") -> None:
        self.model_path = model_path
        self._loadModel()

    def _loadModel(self) -> None:
        self.model = AutoModelForCausalLM.from_pretrained(self.model_path)
        self.tokenizer = AutoTokenizer.from_pretrained(self.model_path)

    def _saveModel(self, path : str = None) -> None:
        if path == None: path = self.model_path
        self.model.save_pretrained(path)
        self.tokenizer.save_pretrained(path)

    def predict(self, prompt : str, return_tensors="pt", debug = False, output_max_length = 100) -> str:
        inputs = self.tokenizer(prompt, return_tensors=return_tensors)

        generate_ids = self.model.generate(inputs.input_ids, max_length=output_max_length)
        output = self.tokenizer.batch_decode(generate_ids, skip_special_tokens=True, clean_up_tokenization_spaces=False)[0]
        if debug: print("output:", output.split("\n"))
        return output.split("\n")

if __name__ == "__main__":
    model = LLM_Model()
    print(model.predict("Hey, are you conscious? Can you talk to me?"))
    print(model.predict("Write a poem about a robot who dreams of becoming a human."))
    print(model.predict("What is a human."))

# if __name__ == "__main__":
#     model = LLM_Model("cognitivecomputations/dolphin-2.9-llama3-8b")
#     print(model.predict("What is a human."))
