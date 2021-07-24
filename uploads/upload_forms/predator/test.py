testcase = int(input('testcase'))

arr_var = input().strip().split()

arr = list(map(int, input().rstrip().split()))

N= int(arr_var[0])
K = int(arr_var[1])
newarr =[]
if(K==1):
    print(max(arr))

for i in range(0,K):
    temp = max(arr)
    newarr.append(temp)
    arr.remove(int(temp))
    for j in range(i,len(arr)-K):
        if(temp==arr[j]):
            newarr.append(arr[j])
            arr.remove(arr[j])

print(newarr)
sum1 =0
for i in range(0,len(newarr)):
    sum1 = sum1+newarr[i]
print(sum1)