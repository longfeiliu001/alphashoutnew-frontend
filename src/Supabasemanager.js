import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pyeiplmxftswzknpldgs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5ZWlwbG14ZnRzd3prbnBsZGdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3ODU3NTQsImV4cCI6MjA2ODM2MTc1NH0.5ulg0h3ZQ-Rd5PMmxN1S4P0ulfZtAg2VjOjJxZpSvBQ';

const supabase = createClient(supabaseUrl, supabaseKey);



export const checkAvailableQuota = async (useremail) => {
  try {
    const { data, error } = await supabase
      .from('user_quota_management')
      .select('*')
      .eq('user_email', useremail) // where condition
      ;
    
    return data[0]?.available_quota ?? null;

  } catch (error) {
    // console.error('Error fetching data:', error);
    alert(error.message);
    return null
  }
};

export const checkTotalUsedQuota = async (useremail) => {
  try {
    const { data, error } = await supabase
      .from('user_quota_management')
      .select('*')
      .eq('user_email', useremail) // where condition
      ;
    
    return data[0]?.total_used_quota ?? null;

  } catch (error) {
    // console.error('Error fetching data:', error);
    alert(error.message);
    return null
  }
};


export const checkTotalFeeCharged = async (useremail) => {
  try {
    const { data, error } = await supabase
      .from('user_quota_management')
      .select('*')
      .eq('user_email', useremail) // where condition
      ;
    
    return data[0]?.total_fee_charged ?? null;

  } catch (error) {
    // console.error('Error fetching data:', error);
    alert(error.message);
    return null
  }
};


export const userFirsttimeCreate = async (useremail) => {
  

     if (!useremail || typeof useremail !== 'string') {
    return ("Valid email is required" );
  }


    try {
      const { error } = await supabase
        .from('user_quota_management')
        .insert([{ 
          user_email: useremail,
          available_quota: 10
        }]);
      
      if (!error) return "New 10 free token is given for new user, enjoy!"
      

    } catch (error) {
       return (error) ;
    }
};



export const updateQuotaMinusOne = async (useremail) => {
  try {

    const rt_available = await checkAvailableQuota(useremail);
        if(rt_available !== null)
        {
                    const { data, error } = await supabase
                    .from('user_quota_management')
                    .update({ available_quota: rt_available- 1 })
                    .eq('user_email', useremail) // where condition
                    .gt('available_quota', 0)
                    .select()
                    ;
                    
                    if (!error)
                    {
                        
                            if(!data || data.length === 0)
                            { return "no sufficient token";}
                            else 
                            { return "success";} 

                    }

                    else 
                        { return "sql error"}
        }else
        {
        return "error";
        }
  } catch (error) {
    // console.error('Error fetching data:', error);
    alert(error.message);
    return "error";
  }
};



export const updateQuotaNewSolanaPaid = async (useremail,amount) => {
  try {
 
    
        if(amount !== null && useremail!== null)
        {
          const numericAmount = parseFloat(amount);
                   const ratio=200;
                   const to_be_added_token_amt = Math.round(amount*ratio);
                  const rt_available = (await checkAvailableQuota(useremail))?? 0;
                   const rt_totalused = (await checkTotalUsedQuota(useremail))?? 0;
                   const rt_totalcharged = (await checkTotalFeeCharged(useremail))?? 0;
                if(rt_available !== null && rt_totalused !== null && rt_totalcharged !== null)
                {
                            const { data, error } = await supabase
                            .from('user_quota_management')
                            .update({ 
                              available_quota: rt_available+to_be_added_token_amt,
                              total_used_quota: rt_totalused+to_be_added_token_amt,
                              total_fee_charged: rt_totalcharged +numericAmount
                            })
                            .eq('user_email', useremail) // where condition                          
                            .select()
                            ;
                            
                            if (!error)
                            {
                                
                                    if(!data || data.length === 0)
                                    { return "No user historical records found!";}
                                    else 
                                    { return "Success added "+to_be_added_token_amt+ " tokens. Enjoy!";} 

                            }

                            else 
                                { return error.message;}
                  }
        }else
        {
        return "error";
        }
  } catch (error) {
    // console.error('Error fetching data:', error);
    alert(error.message);
    return "error";
  }
};