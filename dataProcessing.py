import json
import matplotlib.pyplot as plt
import numpy as np

acc_total = [[],[],[]]
for i in range(3):
    jsonString = open(f"ShapesNN_T{i+1}.json")
    data = json.load(jsonString) #Converts to dict
    

    for item in data:
        
        y = []
        accuracy = (data[item][0][0] + data[item][1][1] + data[item][2][2]) / (sum(data[item][0])+sum(data[item][1])+sum(data[item][2])) #Adds all the true positives together
        accuracy = round(accuracy*100,2)
        #print(accuracy)
        acc_total[i].append(accuracy)
        y.append(item)

    # plot:
print(acc_total[0])
print(acc_total[1])
print(acc_total[2])
npAcc_total = np.array(acc_total)
av_acc = np.average(npAcc_total, axis=0)

print(av_acc)