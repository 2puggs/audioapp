from selenium import webdriver
import pandas as pd
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager

import matplotlib.pyplot as plt
import numpy as np

options = webdriver.ChromeOptions()
driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()))

def main():

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
   print(data)  
   if len(data) > 0:
      print(f"Scraped {len(data)} rows successfully.")
   else:
      print("No data was scraped.")
   
   df = pd.DataFrame(data, columns=["#","Title", "Artist", "Release", "BPM", "Energy", "Dance", "Loud", "Valence", "Length", "Acoustic", "Pop", "A Sep.", "Rand"])
   #relative_path = 'spotify-demo/src/webscrape/scraped_data.csv'
   #df.to_csv(relative_path, index=False)
   
   df = df.drop(['#', 'Release','Length','Pop','A Sep.', 'Rand','Loud','Valence','Acoustic'], axis=1)
   df.to_csv('spotify-demo/src/webscrape/data/scraped_data.csv', index=False)
   print("Data saved to scraped_data.csv")
   
   
   driver.quit() 
   #in the overwrite.csv i'll append on the columns 
  
   #NOTES: Isoxo songs didn't get categorized?  is not categorized properly and not all of them get put into the genre, it may be better to loop over the duration list instead of the genre list 
   
   #going to write and create plots for bpm v energy and danceability vs valence 
   #read bpm and energy and plot dots based on artist 
   #fig = plt.figure()
   """  artist = df['Artist'].to_numpy()

Create a color map for the artists
   unique_artists = np.unique(artist)
   #unique_artists = df['Artist'].unique()
   colors = plt.cm.rainbow(np.linspace(0, 1, len(unique_artists)))
   color_map = dict(zip(unique_artists, colors))
   plt.scatter(df['BPM'].to_numpy(), df['Energy'].to_numpy(), 'o', color=color_map[unique_artists], label=unique_artists)
   #plt.scatter(x, y)
   plt.legend(unique_artists)
   plt.set_xlabel("BPM", fontsize=15)
   plt.set_ylabel("ENERGY", fontsize=15)
   plt.set_title('BPM VS ENERGY')
   plt.show()
   """
# ok now i want to pull certains columns from the organizeyourmusic.playlistmachinry.com " dB. and genre" try to parse the curated webpage by column 

# Close the driver 

if __name__ == '__main__':
   main()