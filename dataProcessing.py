import json
#import matplotlib.pyplot as plt
import numpy as np

acc_total = [[],[],[]]
y = [[],[],[]] #Quick and dirty solution to average the averages and match their respective sample sizes. Not good, but it works
for i in range(3):
    jsonString = open(f"ShapesNN_T{i+1}.json")
    data = json.load(jsonString) #Converts to dict
    

    for item in data:
        
        
        accuracy = (data[item][0][0] + data[item][1][1] + data[item][2][2]) / (sum(data[item][0])+sum(data[item][1])+sum(data[item][2])) #Adds all the true positives together
        accuracy = round(accuracy*100,2)
        #print(accuracy)
        acc_total[i].append(accuracy)
        y[i].append(item)

    # plot:
print(acc_total[0])
print(acc_total[1])
print(acc_total[2])
npAcc_total = np.array(acc_total)
av_acc = np.average(npAcc_total, axis=0)

for i in range(len(av_acc)):
    print(f"Sample Size: {y[0][i]} | Accuracy: {round(av_acc[i],2)}")