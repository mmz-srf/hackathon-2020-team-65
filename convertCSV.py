import csv

with open('npi.csv') as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    line_count = 0
    measures = []
    scol = 6
    fcol = 30
    startd = []
    for row in csv_reader:
        if(line_count is 0):
            dateline = row
        line_count +=1
        for i in range(scol,fcol):
            if(row[i] is '1'):
                print(dateline[i])
                measures.append(row[2])
                startd.append(dateline[i])
                break
        #print("line_count", line_count, "text", row[28])
        

print(measures)
print(startd)
print (len(startd), print(len(measures)))
for i in range(0, len(startd)):
    print(measures[i], startd[i])

f = open('outfile.csv', 'w')

with f:

    writer = csv.writer(f)
    
    for i in range(0, len(startd)):
        writer.writerow([measures[i], startd[i]])

print(len(startd))