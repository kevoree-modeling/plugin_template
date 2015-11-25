class kmf.templateTest.Park {
    att name : String
    rel cars : kmf.templateTest.Car
}

class kmf.templateTest.Car {
    att name : String
    att nbPorte : Double
    rel winterTyres : kmf.templateTest.WinterTyre with maxBound 4
}

class kmf.templateTest.WinterTyre {
    att mark : String
    rel color :  kmf.templateTest.Color with maxBound 1
}

class kmf.templateTest.Color {
    att color : String
}
