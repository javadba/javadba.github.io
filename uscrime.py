import sys
execfile("/Users/steve/.ipystartup")
gitbase='/git/cs498/'

pd.set_option('display.max_rows', 50)
pd.set_option('display.max_columns', 500)
pd.set_option('display.width', 1200)

import pandas as pd
import matplotlib.pyplot as plt
import pandasql as psql

git= '/git/javadba.github.io'
ddir = git + '/data'
lnd = pd.read_csv(ddir + '/LND01.csv')
lnd2 = lnd.loc[: ,['Areaname', 'STCOU', 'LND110210D']]
lnd2.rename(columns={'LND110210D':'county_area'},inplace=True)
lnd2.to_csv(ddir+'/landSummary.csv')
lnd2 = pd.read_csv(ddir + '/landSummary.csv')
p(lnd2.columns)
csumm = pd.read_csv(ddir+'/usCountyCrimeSummary.csv')
csumm.drop(['crime_rate_bucket','population_bucket'],axis=1,inplace=True)
csumm.rename(columns={'crime_rate':'county_crime_rate','total_crimes':'county_total_crimes'},inplace=True)
p(csumm.columns)
pd.set_option("display.max_columns",100)
pd.set_option("display.width",500)
pd1 = psql.sqldf('select c.*, l.* from csumm c inner join lnd2 l on c.fips_code = l.STCOU order by State, County', locals())
p(pd1.head())
p(pd1.columns)

pd2 = psql.sqldf('select *, county_pop/pd1.county_area county_pop_density from pd1', locals())
pd2.rename(columns={'county_area': 'County_Area', 'county_crime_rate':'County_Crime_Rate','county_total_crimes':'County_Total_Crimes','county_pop': 'County_Population',
                     'county_pop_density':'County_Population_Density',},inplace=True)
p(psql.sqldf('select count(distinct County_Area) from pd2',locals()))
p(psql.sqldf('select count(distinct County) from pd2',locals()))
p(psql.sqldf('select count(distinct fips_code) from pd2',locals()))
adf = psql.sqldf("select * from pd2 where State = 'Alaska'",locals())
p(adf)
p(psql.sqldf("select min(County_Crime_Rate) min_rate from adf where State = 'Alaska'",locals()))
pd2b = psql.sqldf('select *, County_Population_Density, sum(County_Population) state_pop, sum(County_Area) state_area, '
                  'sum(County_Population)/sum(County_Area) state_pop_density, sum(County_Total_Crimes)/sum(County_Area) state_crime_rate, '
                  'sum(County_Total_Crimes) as state_total_crimes from pd2 group by State', locals())
pd2b.rename(columns={'county_area': 'County_Area', 'county_crime_rate':'County_Crime_Rate','county_total_crimes':'County_Total_Crimes','county_pop': 'County_Population','county_pop_density':'County_Population_Density',
                      'state_area': 'State_Area', 'state_crime_rate':'State_Crime_Rate','state_total_crimes':'State_Total_Crimes','state_pop': 'State_Population','state_pop_density':'State_Population_Density',
                      },inplace=True)
pd3 = psql.sqldf('select pd2.*, pd2b.State_Area, pd2b.State_Crime_Rate, pd2b.State_Total_Crimes, pd2b.State_Population, pd2b.State_Population_Density from pd2b join pd2 on pd2b.State = pd2.State',locals())
p(pd3.count)
p(pd3.columns)
pd3.to_json(ddir + '/combinedDataColsRenamed.json',orient='records')
with open(ddir + '/combinedDataColsRenamed.json','r+') as f:
  fc = f.read()
  f.seek(0)
  fco = fc.replace('},{','},\n{')
  f.write(fco)

#
# "Northeast,New England ":"Connecticut, Maine, Massachusetts, New Hampshire, Rhode Island,Vermont"
# "Northeast,Mid-Atlantic ": "New Jersey, New York, and Pennsylvania"
# "Midwest,East North Central ":"Illinois, Indiana, Michigan, Ohio, Wisconsin"
# "Midwest,West North Central ":"Iowa, Kansas, Minnesota, Missouri, Nebraska, North Dakota,  South Dakota"
# "South,South Atlantic ":"Delaware, Florida, Georgia, Maryland, North Carolina, South Carolina, Virginia, District of Columbia, West Virginia"
# "South,East South Central ":"Alabama, Kentucky, Mississippi, Tennessee"
# "South,West South Central ":"Arkansas, Louisiana, Oklahoma, Texas"
# "West,Mountain ":"Arizona, Colorado, Idaho, Montana, Nevada, New Mexico, Utah, Wyoming"
# "West,Pacific ":"Alaska, California, Hawaii, Oregon, and Washington"
#


pd2.to_csv(ddir+'/combinedState.csv')
p(pd2.shape)
p(pd2.iloc[:3, :])
pd2.to_csv(ddir+'/combinedData.csv')
pd2.to_json(ddir+'/combinedData.json',orient='records')
import statsmodels.formula.api as sm
result = sm.ols('county_crime_rate ~ county_pop_density',pd2).fit()
print result.params
plt.plot(pd2['county_pop_density'],pd2['county_crime_rate'])
plt.show()
plt.title('State crime rate vs population density')
plt.yscale('log')
plt.xscale('log')
plt.scatter(np.array(pd2['state_pop_density']),np.array(pd2['state_crime_rate']))
plt.show()
plt.title('County crime rate vs population density')
plt.xlabel('County Population Density\nPersons/Mile^2')
plt.ylabel('County Crime Rate\nCrime / 100K Persons')
plt.scatter(np.array(pd2['county_pop_density']),np.array(pd2['county_crime_rate']))
plt.xscale('log')
plt.yscale('log')
plt.show()



