import time
import random
format = "R01G02T%02d%02d+%s+"
types = ["WT","DT","LT","PT", "XX"]



def slot(min, sec, label):
  for m in range(min,-1, -1):
    for s in range(sec,-1, -1):
      print format % (m, s, label)
      time.sleep(1)

while 1:
  slot(0,30,"PT")
  slot(0,30, "NF")
  slot(0,30, "WT")
  slot(0,30, "LT")
  slot(0,30, "DT")

