package com.example.helloendpoints;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.appengine.api.oauth.OAuthRequestException;
import com.google.appengine.api.users.User;

import java.util.ArrayList;

import javax.inject.Named;


@Api(
        name = "finra",
        version = "v1",
        scopes = {Constants.EMAIL_SCOPE},
        clientIds = {Constants.API_EXPLORER_CLIENT_ID, Constants.WEB_CLIENT_ID, Constants.ANDROID_CLIENT_ID, Constants.IOS_CLIENT_ID},
        audiences = {Constants.ANDROID_AUDIENCE}
)

public class TelephoneAlphaNumerics {



    public ArrayList<String> getNumbers(@Named("num") String num, @Named("id") Integer id, User s) throws Exception {
        if(s == null){
            throw new OAuthRequestException("not authorized");
        }
        num = filteredDigits(num);
        final int ITEMS_PER_PAGE = 10;

        String tblstr = new StringBuilder(num).reverse().toString();
        Tumbler t = new Tumbler(tblstr, id * ITEMS_PER_PAGE);
        ArrayList<String> toReturn = new ArrayList<String>();
        int i = 0;
        do {
            i++;
            t.tumble();
            toReturn.add(new StringBuilder(t.toString()).reverse().toString());
        } while (!t.toString().equals(tblstr) && i < ITEMS_PER_PAGE);

        return toReturn;
    }

    private static String filteredDigits(String s) throws Exception {
        if (s.length() > 20)
            throw new Exception("input too long");

        StringBuilder builder = new StringBuilder();
        for (char c : s.toCharArray()) {
            if (Character.isDigit(c))
                builder.append(c);
        }
        s = builder.toString();
        if(s.length() < 7)
            throw new Exception("input too short");

        return builder.toString();
    }

    public HelloGreeting getCount(@Named("num") String num, User s) throws Exception {
        if(s == null){
            throw new OAuthRequestException("not authorized");
        }
        HelloGreeting g = new HelloGreeting();
        num = filteredDigits(num);
        g.setMessage(Integer.toString(Tumbler.getCount(num)));
        return g;
    }


    @ApiMethod(name = "greetings.authed", path = "hellogreeting/authed")
    public HelloGreeting authedGreeting(User user) {
        //System.out.println(user);
        HelloGreeting response = new HelloGreeting("hello");//+ user.getEmail()
        return response;
    }
}
