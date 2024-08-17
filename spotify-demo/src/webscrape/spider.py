from selenium import webdriver
import pandas as pd
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

options = webdriver.ChromeOptions()
driver = webdriver.Chrome(options=Options())

"""
call sortyourmusic.playlistmachinery.com
wait for response, 

if response, call main 
call the website, 
enter in permission
use the main function to scrape the playlist made from 
"""

def main():

   try:
      driver.get('http://sortyourmusic.playlistmachinery.com')
      #print("finished")
      input("Please log in and select the playlist, then press Enter to continue...")

      WebDriverWait(driver, 70).until(EC.presence_of_element_located((By.CSS_SELECTOR, "#song-table_wrapper")))
      #WebDriverWait(driver, 70).until(EC.presence_of_all_elements_located((By.XPATH, '//*[@id="song-table"]/tbody/tr')))
      tbody = driver.find_element(By.XPATH, '//*[@id="song-table"]/tbody')
   
      #store data scraped
      data = []
      #14 data cells 
      for tr in tbody.find_elements(By.XPATH, './tr'):
         #get text in each row 
         row = [item.text for item in tr.find_elements(By.XPATH,'./td')]
         data.append(row)
         
      if len(data) > 0:
         print(f"Scraped {len(data)} rows successfully.")
      else:
         print("No data was scraped.")
      
      df = pd.DataFrame(data, columns=["Column1", "Column2", "Column3", "Column4", "Column5", "Column6", "Column7", "Column8", "Column9", "Column10", "Column11", "Column12", "Column13", "Column14"])
      relative_path = 'spotify-demo/src/webscrape/scraped_data.csv'
      df.to_csv(relative_path, index=False)
      print("Data saved to scraped_data.csv")
         
   except Exception as e:
      print(f"An error occurred: {e}")

   # Close the driver
   driver.quit()  
   
if __name__ == '__main__':
   main()